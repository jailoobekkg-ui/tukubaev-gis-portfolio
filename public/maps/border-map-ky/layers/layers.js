ol.proj.proj4.register(proj4);
//ol.proj.get("EPSG:32643").setExtent([-247065.709573, 3934215.593783, 1103529.773501, 5005258.519457]);
var wms_layers = [];


        var lyr_ESRIWorldTopo_0 = new ol.layer.Tile({
            'title': 'ESRI World Topo',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
            })
        });

        var lyr_satelitegooglemaps_1 = new ol.layer.Tile({
            'title': 'satelite googlemaps',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
            })
        });

        var lyr_OpenStreetMap_2 = new ol.layer.Tile({
            'title': 'OpenStreetMap',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });
var format_maska_3 = new ol.format.GeoJSON();
var features_maska_3 = format_maska_3.readFeatures(json_maska_3, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource_maska_3 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_maska_3.addFeatures(features_maska_3);
var lyr_maska_3 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_maska_3, 
                style: style_maska_3,
                popuplayertitle: 'maska',
                interactive: false,
              /*  title: '<img src="styles/legend/maska_3.png" /> maska' */
            });
var format__4 = new ol.format.GeoJSON();
var features__4 = format__4.readFeatures(json__4, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource__4 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource__4.addFeatures(features__4);
var lyr__4 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource__4, 
                style: style__4,
                popuplayertitle: 'Чек ара тилкеси',
                interactive: false,
                title: '<img src="styles/legend/_4.png" /> Чек ара тилкеси'
            });
var format__5 = new ol.format.GeoJSON();
var features__5 = format__5.readFeatures(json__5, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource__5 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource__5.addFeatures(features__5);
var lyr__5 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource__5, 
                style: style__5,
                popuplayertitle: 'Чек ара аймагы',
                interactive: false,
                title: '<img src="styles/legend/_5.png" /> Чек ара аймагы'
            });
var format__6 = new ol.format.GeoJSON();
var features__6 = format__6.readFeatures(json__6, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource__6 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource__6.addFeatures(features__6);
cluster__6 = new ol.source.Cluster({
  distance: 30,
  source: jsonSource__6
});
var lyr__6 = new ol.layer.Vector({
                declutter: false,
                source:cluster__6, 
                style: style__6,
                popuplayertitle: 'Калкты тейлөө борбору',
                interactive: true,
                title: '<img src="styles/legend/_6.png" /> Калкты тейлөө борбору'
            });
var format__7 = new ol.format.GeoJSON();
var features__7 = format__7.readFeatures(json__7, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource__7 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource__7.addFeatures(features__7);
var lyr__7 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource__7,
maxResolution:56.00893230452392,
 
                style: style__7,
                popuplayertitle: 'Айыл аймактар',
                interactive: false,
                title: '<img src="styles/legend/_7.png" /> Айыл аймактар'
            });
var format__8 = new ol.format.GeoJSON();
var features__8 = format__8.readFeatures(json__8, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource__8 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource__8.addFeatures(features__8);
var lyr__8 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource__8,
maxResolution:280.0446615226196,
 minResolution:42.00669922839295,

                style: style__8,
                popuplayertitle: 'Райондор',
                interactive: false,
                title: '<img src="styles/legend/_8.png" /> Райондор'
            });
var format__9 = new ol.format.GeoJSON();
var features__9 = format__9.readFeatures(json__9, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource__9 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource__9.addFeatures(features__9);
var lyr__9 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource__9, 
                style: style__9,
                popuplayertitle: 'Мамлекеттик чек ара',
                interactive: false,
                title: '<img src="styles/legend/_9.png" /> Мамлекеттик чек ара'
            });
var format__10 = new ol.format.GeoJSON();
var features__10 = format__10.readFeatures(json__10, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource__10 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource__10.addFeatures(features__10);
var lyr__10 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource__10,
maxResolution:152.3442958683051,
 
                style: style__10,
                popuplayertitle: 'Калктуу конуштар',
                interactive: false,
    title: 'Калктуу конуштар<br />\
    <img src="styles/legend/_10_0.png" /> Борбор<br />\
    <img src="styles/legend/_10_1.png" /> Облус борбору<br />\
    <img src="styles/legend/_10_2.png" /> Калктуу конуш > 10 000<br />\
    <img src="styles/legend/_10_3.png" /> Калктуу конуш < 10 000<br />' });
var format___11 = new ol.format.GeoJSON();
var features___11 = format___11.readFeatures(json___11, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource___11 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource___11.addFeatures(features___11);
cluster___11 = new ol.source.Cluster({
  distance: 30,
  source: jsonSource___11
});
var lyr___11 = new ol.layer.Vector({
                declutter: false,
                source:cluster___11, 
                style: style___11,
                popuplayertitle: 'Туристик_объектилер',
                interactive: true,
    title: 'Туристик_объектилер<br />\
    <img src="styles/legend/__11_0.png" /> Ашуу жана өрөөн<br />\
    <img src="styles/legend/__11_1.png" /> Жаратылыш паркы<br />\
    <img src="styles/legend/__11_2.png" /> Капчыгай жана каньон<br />\
    <img src="styles/legend/__11_3.png" /> Көл<br />\
    <img src="styles/legend/__11_4.png" /> Тарыхий эстелик<br />\
    <img src="styles/legend/__11_5.png" /> Тоо<br />\
    <img src="styles/legend/__11_6.png" /> шаар<br />' });
var format__12 = new ol.format.GeoJSON();
var features__12 = format__12.readFeatures(json__12, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource__12 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource__12.addFeatures(features__12);
cluster__12 = new ol.source.Cluster({
  distance: 30,
  source: jsonSource__12
});
var lyr__12 = new ol.layer.Vector({
                declutter: false,
                source:cluster__12, 
                style: style__12,
                popuplayertitle: 'КПП',
                interactive: true,
                title: '<img src="styles/legend/_12.png" /> КПП'
            });

lyr_ESRIWorldTopo_0.setVisible(false);lyr_satelitegooglemaps_1.setVisible(false);lyr_OpenStreetMap_2.setVisible(true);lyr_maska_3.setVisible(true);lyr__4.setVisible(true);lyr__5.setVisible(true);lyr__6.setVisible(true);lyr__7.setVisible(true);lyr__8.setVisible(true);lyr__9.setVisible(true);lyr__10.setVisible(true);lyr___11.setVisible(true);lyr__12.setVisible(true);
var layersList = [lyr_ESRIWorldTopo_0,lyr_satelitegooglemaps_1,lyr_OpenStreetMap_2,lyr_maska_3,lyr__4,lyr__5,lyr__6,lyr__7,lyr__8,lyr__9,lyr__10,lyr___11,lyr__12];
lyr_maska_3.set('fieldAliases', {'fid': 'fid', 'OBJECTID_1': 'OBJECTID_1', 'OBJECTID': 'OBJECTID', 'Name': 'Name', 'Shape_Leng': 'Shape_Leng', 'Shape_Le_1': 'Shape_Le_1', 'Shape_Area': 'Shape_Area', });
lyr__4.set('fieldAliases', {'fid': 'fid', 'OBJECTID': 'OBJECTID', 'Shape_Leng': 'Shape_Leng', 'Shape_Area': 'Shape_Area', });
lyr__5.set('fieldAliases', {'fid': 'fid', 'OBJECTID': 'OBJECTID', 'Shape_Leng': 'Shape_Leng', 'Shape_Area': 'Shape_Area', });
lyr__6.set('fieldAliases', {'fid': 'fid', 'ЦОН': 'ЦОН', 'Адрес': 'Адрес', 'Режим': 'Режим', });
lyr__7.set('fieldAliases', {'fid': 'fid', 'name_kgz': 'name_kgz', 'name_en': 'name_en', 'name_ru': 'name_ru', });
lyr__8.set('fieldAliases', {'fid': 'fid', 'name_en': 'name_en', 'name_ru': 'name_ru', 'name_ky': 'name_ky', });
lyr__9.set('fieldAliases', {'fid': 'fid', 'OBJECTID_1': 'OBJECTID_1', 'Name': 'Name', 'Shape_Leng': 'Shape_Leng', });
lyr__10.set('fieldAliases', {'fid': 'fid', 'OBJECTID_1': 'OBJECTID_1', 'Name_ru': 'Name_ru', 'Name_en': 'Name_en', 'СОАТЕ': 'СОАТЕ', 'Pop_2018': 'Pop_2018', 'Name_kg': 'Name_kg', 'type': 'type', });
lyr___11.set('fieldAliases', {'fid': 'fid', 'Name': 'Name', 'Type': 'Type', });
lyr__12.set('fieldAliases', {'fid': 'fid', 'name_kg': 'name_kg', 'location': 'location', 'mode': 'mode', });
lyr_maska_3.set('fieldImages', {'fid': '', 'OBJECTID_1': 'TextEdit', 'OBJECTID': 'TextEdit', 'Name': 'TextEdit', 'Shape_Leng': 'TextEdit', 'Shape_Le_1': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr__4.set('fieldImages', {'fid': '', 'OBJECTID': 'TextEdit', 'Shape_Leng': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr__5.set('fieldImages', {'fid': '', 'OBJECTID': 'TextEdit', 'Shape_Leng': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr__6.set('fieldImages', {'fid': '', 'ЦОН': 'TextEdit', 'Адрес': 'TextEdit', 'Режим': 'TextEdit', });
lyr__7.set('fieldImages', {'fid': '', 'name_kgz': 'TextEdit', 'name_en': 'TextEdit', 'name_ru': 'TextEdit', });
lyr__8.set('fieldImages', {'fid': 'TextEdit', 'name_en': 'TextEdit', 'name_ru': 'TextEdit', 'name_ky': 'TextEdit', });
lyr__9.set('fieldImages', {'fid': '', 'OBJECTID_1': 'TextEdit', 'Name': 'TextEdit', 'Shape_Leng': 'TextEdit', });
lyr__10.set('fieldImages', {'fid': 'TextEdit', 'OBJECTID_1': 'TextEdit', 'Name_ru': 'TextEdit', 'Name_en': 'TextEdit', 'СОАТЕ': 'TextEdit', 'Pop_2018': 'TextEdit', 'Name_kg': 'TextEdit', 'type': 'TextEdit', });
lyr___11.set('fieldImages', {'fid': 'TextEdit', 'Name': 'TextEdit', 'Type': 'TextEdit', });
lyr__12.set('fieldImages', {'fid': 'TextEdit', 'name_kg': 'TextEdit', 'location': 'TextEdit', 'mode': 'TextEdit', });
lyr_maska_3.set('fieldLabels', {'fid': 'no label', 'OBJECTID_1': 'no label', 'OBJECTID': 'no label', 'Name': 'no label', 'Shape_Leng': 'no label', 'Shape_Le_1': 'no label', 'Shape_Area': 'no label', });
lyr__4.set('fieldLabels', {'fid': 'hidden field', 'OBJECTID': 'no label', 'Shape_Leng': 'no label', 'Shape_Area': 'no label', });
lyr__5.set('fieldLabels', {'fid': 'no label', 'OBJECTID': 'no label', 'Shape_Leng': 'no label', 'Shape_Area': 'no label', });
lyr__6.set('fieldLabels', {'fid': 'hidden field', 'ЦОН': 'inline label - visible with data', 'Адрес': 'no label', 'Режим': 'no label', });
lyr__7.set('fieldLabels', {'fid': 'no label', 'name_kgz': 'no label', 'name_en': 'no label', 'name_ru': 'no label', });
lyr__8.set('fieldLabels', {'fid': 'no label', 'name_en': 'no label', 'name_ru': 'no label', 'name_ky': 'no label', });
lyr__9.set('fieldLabels', {'fid': 'no label', 'OBJECTID_1': 'no label', 'Name': 'no label', 'Shape_Leng': 'no label', });
lyr__10.set('fieldLabels', {'fid': 'no label', 'OBJECTID_1': 'no label', 'Name_ru': 'no label', 'Name_en': 'no label', 'СОАТЕ': 'no label', 'Pop_2018': 'no label', 'Name_kg': 'no label', 'type': 'no label', });
lyr___11.set('fieldLabels', {'fid': 'hidden field', 'Name': 'no label', 'Type': 'no label', });
lyr__12.set('fieldLabels', {'fid': 'hidden field', 'name_kg': 'no label', 'location': 'no label', 'mode': 'no label', });
lyr__12.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});