// Wilayah Studi
var studyArea = ee.FeatureCollection('FAO/GAUL_SIMPLIFIED_500m/2015/level2')
  .filter(ee.Filter.eq('ADM2_NAME', 'Sidenreng Rappang'));

// Sentinel-2 SR 2018 - Cloud Masking
function maskS2clouds(image) {
  var qa = image.select('QA60');
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
              .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask).divide(10000);
}

var s2 = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterDate('2018-01-01', '2018-12-31')
  .filterBounds(studyArea)
  .map(maskS2clouds);

var median = s2.median().clip(studyArea);

// Visualisasi
var trueColor = median.visualize({bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3});
var falseColor = median.visualize({bands: ['B8', 'B4', 'B3'], min: 0, max: 0.3});
var ndvi = median.normalizedDifference(['B8', 'B4']).rename('NDVI');
var ndwi = median.normalizedDifference(['B3', 'B8']).rename('NDWI');
var nbr = median.normalizedDifference(['B8', 'B12']).rename('NBR');

// UI Panel Kiri
var leftPanel = ui.Panel({style: {width: '300px', padding: '8px'}});

leftPanel.add(ui.Label('Expert Annotation Tool', {fontWeight: 'bold', fontSize: '18px'}));
leftPanel.add(ui.Label('Citra: Sentinel-2 SR 2018 (median)'));
leftPanel.add(ui.Label('Area: Sidenreng Rappang, Sulsel'));
leftPanel.add(ui.Label(''));

leftPanel.add(ui.Label('Kunci Interpretasi LULC:', {fontWeight: 'bold'}));
var pdfLink = ui.Label('Klik di sini (PDF)', {
  fontWeight: 'normal',
  color: 'blue'
});
pdfLink.setUrl('https://drive.google.com/file/d/1_eI22tF-3LW7Ri3oXggSUIpqqOrNlOD6/view?usp=sharing'); // file pdf kunci interpretasi
leftPanel.add(pdfLink);
leftPanel.add(ui.Label(''));

// Dropdown layer bantu
leftPanel.add(ui.Label('Layer Tambahan:', {fontWeight: 'bold'}));
var layerSelector = ui.Select({
  items: ['None', 'NDVI', 'NDWI', 'NBR'],
  onChange: function(value) {
    map1.layers().reset([ui.Map.Layer(trueColor)]);
    map2.layers().reset([ui.Map.Layer(falseColor)]);
    if (value === 'NDVI') map1.addLayer(ndvi, {min: 0, max: 1, palette: ['white', 'green']}, 'NDVI');
    else if (value === 'NDWI') map1.addLayer(ndwi, {min: -1, max: 1, palette: ['white', 'blue']}, 'NDWI');
    else if (value === 'NBR') map1.addLayer(nbr, {min: -1, max: 1, palette: ['white', 'red']}, 'NBR');
  }
});
leftPanel.add(layerSelector);
leftPanel.add(ui.Label(''));

// Dropdown kelas LULC saat anotasi
leftPanel.add(ui.Label('Pilih Kelas LULC:', {fontWeight: 'bold'}));

var classList = [
  '1. Undisturbed Dryland Forest', '2. Logged-Over Dryland Forest',
  '3. Undisturbed Mangrove Forest', '4. Logged-Over Mangrove Forest',
  '5. Undisturbed Swamp Forest', '6. Logged-Over Swamp Forest',
  '7. Agroforestry', '8. Plantation Forest', '9. Rubber Monoculture',
  '10. Oil Palm Monoculture', '11. Other Monoculture', '12. Grass or Savanna',
  '13. Shrub', '14. Cropland', '15. Settlement', '16. Cleared Land',
  '17. Water Bodies'
];

var classDropdown = ui.Select({
  items: classList,
  placeholder: 'Pilih kelas sebelum menggambar'
});
leftPanel.add(classDropdown);

// Tooltip Panduan
leftPanel.add(ui.Label('Panduan:', {fontWeight: 'bold'}));
leftPanel.add(ui.Label('1. Pilih kelas LULC.'));
leftPanel.add(ui.Label('2. Gunakan alat polygon di peta.'));
leftPanel.add(ui.Label('3. Poligon akan otomatis diberi label.'));

// ========================
// Drawing & Annotation
// ========================
var drawn = ui.Map.DrawingTools();
drawn.setShown(true);
drawn.setDrawModes(['polygon']);

var annotations = ee.FeatureCollection([]);

// Event saat selesai menggambar
drawn.onDraw(function(shape) {
  var selectedClass = classDropdown.getValue();
  if (!selectedClass) {
    ui.alert('Pilih kelas LULC terlebih dahulu sebelum menggambar.');
    return;
  }

  var newFeature = ee.Feature(shape.geometry(), {
    'lulc_class': selectedClass
  });

  annotations = annotations.merge(ee.FeatureCollection([newFeature]));
  print('Total anotasi:', annotations.size());
});

// ========================
// Split Panel Map
var map1 = ui.Map();
var map2 = ui.Map();
map1.setCenter(119.95, -3.8, 10);
map1.addLayer(trueColor, {}, 'True Color');
map2.addLayer(falseColor, {}, 'False Color');

var linker = ui.Map.Linker([map1, map2]);
ui.root.clear();
ui.root.add(leftPanel);
ui.root.add(ui.SplitPanel(map1, map2, 'horizontal'));

// Tombol Simpan Anotasi
// ========================
leftPanel.add(ui.Label('Simpan Anotasi:', {fontWeight: 'bold'}));

// Input nama file ekspor
var exportNameBox = ui.Textbox({
  placeholder: 'Nama file ekspor (tanpa spasi)',
  value: 'LULC_Annotations_2018'
});
leftPanel.add(exportNameBox);

// Tombol ekspor ke Drive
var exportDriveBtn = ui.Button({
  label: 'Simpan ke Google Drive',
  style: {stretch: 'horizontal'},
  onClick: function() {
    var name = exportNameBox.getValue().replace(/\s+/g, '_');
    if (annotations.size().getInfo() === 0) {
      ui.alert('Belum ada anotasi untuk disimpan.');
      return;
    }

    Export.table.toDrive({
      collection: annotations,
      description: name + '_toDrive',
      fileNamePrefix: name,
      fileFormat: 'GeoJSON'
    });

    ui.alert('Permintaan ekspor ke Google Drive telah dikirim ke Tasks tab.');
  }
});
leftPanel.add(exportDriveBtn);

// Tombol ekspor ke GEE Asset
var exportAssetBtn = ui.Button({
  label: 'Simpan ke GEE Asset',
  style: {stretch: 'horizontal'},
  onClick: function() {
    var name = exportNameBox.getValue().replace(/\s+/g, '_');
    if (annotations.size().getInfo() === 0) {
      ui.alert('Belum ada anotasi untuk disimpan.');
      return;
    }

    Export.table.toAsset({
      collection: annotations,
      description: name + '_toAsset',
      assetId: 'users/ee-marzuki/' + name  
    });

    ui.alert('Permintaan ekspor ke GEE Asset telah dikirim ke Tasks tab.');
  }
});
leftPanel.add(exportAssetBtn);