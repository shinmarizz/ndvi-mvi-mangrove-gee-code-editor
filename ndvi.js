Map.centerObject(geometry2, 12);

var sentinel = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(geometry2)                         
  .filterDate("2017-01-01", "2017-12-31")
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .median();

print('Jumlah citra terpakai:', ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(geometry2)
  .filterDate("2017-01-01", "2017-12-31")
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .size());

var sentinelClip = sentinel.clip(geometry2);

var rgb = {bands: ['B4','B3','B2'], min: 0, max: 3000};
Map.addLayer(sentinelClip, rgb, 'RGB 2017');


var ndvi = sentinelClip.normalizedDifference(['B8','B4']).rename('NDVI');
Map.addLayer(ndvi, {min:0, max:1, palette:['brown','white','green']}, 'NDVI');

var seaVeg = ndvi.gt(0.5);
Map.addLayer(seaVeg, {min:0, max:1, palette:['white','green']}, 'Non-Vegetasi dan Vegetasi');


var seaW = ee.Image(1).clip(geometry2);          
seaW = seaW.where(ndvi.lte(-0.1), 0);           
seaW = seaW.where(ndvi.gte(0.5), 2);             
Map.addLayer(seaW, {min:0, max:2, palette:['blue','white','green']}, 'Klasifikasi NDVI');


var vegMask = seaVeg.gte(0.5);
var maskedVeg = seaVeg.updateMask(vegMask);
Map.addLayer(maskedVeg, {min:0, max:1, palette:['green']}, 'Layer Vegetasi');


var mvi = sentinelClip.expression('(NIR-GREEN)/(SWIR-GREEN)', {
  'NIR': sentinelClip.select('B8'),
  'GREEN': sentinelClip.select('B3'),
  'SWIR': sentinelClip.select('B11')
}).rename('MVI');

var mviVis = {min:-1, max:1, palette:['darkgreen','white']};
Map.addLayer(mvi, mviVis, 'MVI');

print('Statistik MVI (cek sebelum set threshold):', mvi.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: geometry2,
  scale: 10,
  maxPixels: 1e13
}));


var mviThreshold = 4.5;
var mviMask = mvi.updateMask(mvi.gte(mviThreshold));
Map.addLayer(mviMask, {palette:['yellow']}, 'Area Kandidat Mangrove (MVI)');

var mangrove = mvi.gte(mviThreshold).selfMask().rename('Hutan_Mangrove');
Map.addLayer(mangrove, {palette:['green']}, 'Hutan Mangrove (MVI)');


var pixelArea = ee.Image.pixelArea().divide(1e4); 
var area = pixelArea.updateMask(mangrove);

var areaM = area.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry2,
  scale: 10,
  maxPixels: 1e13
});
print("Luas area mangrove (ha):", areaM);


var button = ui.Button({
  label: 'Get Map Center',
  onClick: function() {
    print(Map.getCenter());
  }
});
print(button);


var checkbox = ui.Checkbox({
  label: 'Tampilkan Layer Mangrove (MVI)',
  value: true,
  onChange: function(checked) {
    if (checked) {
      Map.addLayer(mangrove, {palette:['orange']}, 'Hutan Mangrove (MVI)');
    } else {
      var layers = Map.layers();
      for (var i = 0; i < layers.length(); i++) {
        if (layers.get(i).getName() === 'Hutan Mangrove (MVI)') {
          layers.remove(layers.get(i));
          break;
        }
      }
    }
  }
});
Map.add(checkbox);


var ndviLayer = ui.Map.Layer(ndvi, {palette:['blue','white','green']}, 'NDVI Value 2017');
Map.layers().add(ndviLayer);

var slider = ui.Slider();
slider.setValue(0.9);
slider.onChange(function(value) {
  ndviLayer.setOpacity(value);   
});
print(slider);


var csrt = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(geometry2);   
var start = ee.Image(csrt.first()).date().get('year').format();
var now = Date.now();
var end = ee.Date(now).format();

var mosaicc = function(range) {
  var mosaic = csrt
    .filterDate(range.start(), range.end())
    .median()
    .clip(geometry2);

  range.start().get('year').evaluate(function(name) {
    var vis = {bands: ['B4','B3','B2'], min: 0, max: 3000};
    var layer = ui.Map.Layer(mosaic, vis, name + ' Composite');
    Map.layers().set(0, layer); 
  });
};

ee.DateRange(start, end).evaluate(function(range) {
  var dateSlider = ui.DateSlider({
    start: range['dates'][0],
    end: range['dates'][1],
    value: null,
    period: 365,
    onChange: mosaicc,
    style: {width: '180px'}
  });
  Map.add(dateSlider.setValue(now));
});


Map.setCenter(107.49993144720833, 6.18574139442205, 6);


var spectralPanel = ui.Panel({
  style: {position: 'bottom-right', width: '420px', padding: '8px'}
});
spectralPanel.add(ui.Label('Klik pada peta untuk melihat respon spektral',
  {fontWeight: 'bold'}));
ui.root.add(spectralPanel);

var spectralBands = ['B2','B3','B4','B5','B6','B7','B8','B8A','B11','B12'];
var wavelengths   = [490, 560, 665, 705, 740, 783, 842, 865, 1610, 2190]; // nm

Map.onClick(function(coords) {
  var point = ee.Geometry.Point(coords.lon, coords.lat);

  Map.layers().set(1, ui.Map.Layer(point, {color: 'FF0000'}, 'Titik Klik'));

  var location = 'lon: ' + coords.lon.toFixed(4) + ', lat: ' + coords.lat.toFixed(4);

  var values = sentinelClip.select(spectralBands).reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: point,
    scale: 10
  });

  values.evaluate(function(result) {
    var reflectanceValues = spectralBands.map(function(b) {
      return result[b] || 0;
    });

    var labels = wavelengths.map(function(w, i) {
      return w + 'nm (' + spectralBands[i] + ')';
    });

    var chart = ui.Chart.array.values({
      array: ee.Array(reflectanceValues),
      axis: 0,
      xLabels: labels
    }).setChartType('LineChart')
      .setOptions({
        title: 'Respon Spektral - ' + location,
        hAxis: {title: 'Band (Panjang Gelombang)', slantedText: true},
        vAxis: {title: 'Nilai Reflektansi'},
        legend: {position: 'none'},
        lineWidth: 2,
        pointSize: 5,
        colors: ['2e7d32']
      });

    spectralPanel.clear();
    spectralPanel.add(ui.Label('Respon Spektral - ' + location, {fontWeight: 'bold'}));
    spectralPanel.add(chart);

    var ndviVal = ndvi.reduceRegion({reducer: ee.Reducer.first(), geometry: point, scale: 10});
    var mviVal = mvi.reduceRegion({reducer: ee.Reducer.first(), geometry: point, scale: 10});

    ndviVal.evaluate(function(nd) {
      mviVal.evaluate(function(mv) {
        spectralPanel.add(ui.Label(
          'NDVI: ' + (nd['NDVI'] !== null && nd['NDVI'] !== undefined ? nd['NDVI'].toFixed(3) : 'N/A') +
          '   |   MVI: ' + (mv['MVI'] !== null && mv['MVI'] !== undefined ? mv['MVI'].toFixed(3) : 'N/A')
        ));
      });
    });
  });
});


Map.setCenter(107.49993144720833, 6.18574139442205, 6);