ol.proj.proj4.register(proj4);
//ol.proj.get("EPSG:32643").setExtent([-138287.912434, 4028837.807141, 1212307.570640, 4960679.665139]);
var wms_layers = [];


        var lyr_ESRIWorldTopo_0 = new ol.layer.Tile({
            'title': 'ESRI World Topo',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS, &copy; OpenStreetMap contributors',
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
            })
        });

        var lyr_satelitegooglemaps_1 = new ol.layer.Tile({
            'title': 'Esri World Imagery',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            })
        });

        var lyr_OpenStreetMap_2 = new ol.layer.Tile({
            'title': 'OpenStreetMap',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
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
var format___4 = new ol.format.GeoJSON();
var features___4 = format___4.readFeatures(json___4, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource___4 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource___4.addFeatures(features___4);
var lyr___4 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource___4, 
                style: style___4,
                popuplayertitle: 'Пограничная_полоса',
                interactive: false,
                title: '<img src="styles/legend/__4.png" /> Пограничная_полоса'
            });
var format___5 = new ol.format.GeoJSON();
var features___5 = format___5.readFeatures(json___5, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource___5 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource___5.addFeatures(features___5);
var lyr___5 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource___5, 
                style: style___5,
                popuplayertitle: 'Приграничная_территория',
                interactive: false,
                title: '<img src="styles/legend/__5.png" /> Приграничная_территория'
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
                popuplayertitle: 'ЦОН',
                interactive: true,
                title: '<img src="styles/legend/_6.png" /> ЦОН'
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
                popuplayertitle: 'Айылные аймаки',
                interactive: false,
                title: '<img src="styles/legend/_7.png" /> Айылные аймаки'
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
                popuplayertitle: 'Районы',
                interactive: false,
                title: '<img src="styles/legend/_8.png" /> Районы'
            });
var format___9 = new ol.format.GeoJSON();
var features___9 = format___9.readFeatures(json___9, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource___9 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource___9.addFeatures(features___9);
var lyr___9 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource___9, 
                style: style___9,
                popuplayertitle: 'Государственная_граница',
                interactive: false,
                title: '<img src="styles/legend/__9.png" /> Государственная_граница'
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
                popuplayertitle: 'Населенные пункты',
                interactive: false,
    title: 'Населенные пункты<br />\
    <img src="styles/legend/_10_0.png" /> Столица<br />\
    <img src="styles/legend/_10_1.png" /> Областные центры<br />\
    <img src="styles/legend/_10_2.png" /> СНП более 10 000<br />\
    <img src="styles/legend/_10_3.png" /> СНП менее 10 000<br />' });
var format__11 = new ol.format.GeoJSON();
var features__11 = format__11.readFeatures(json__11, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource__11 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource__11.addFeatures(features__11);
cluster__11 = new ol.source.Cluster({
  distance: 30,
  source: jsonSource__11
});
var lyr__11 = new ol.layer.Vector({
                declutter: false,
                source:cluster__11, 
                style: style__11,
                popuplayertitle: 'Достопримечательности',
                interactive: true,
    title: 'Достопримечательности<br />\
    <img src="styles/legend/_11_0.png" /> Города<br />\
    <img src="styles/legend/_11_1.png" /> Горы<br />\
    <img src="styles/legend/_11_2.png" /> Культура<br />\
    <img src="styles/legend/_11_3.png" /> Озера<br />\
    <img src="styles/legend/_11_4.png" /> Парки и Заповедники<br />\
    <img src="styles/legend/_11_5.png" /> Перевалы и долины<br />\
    <img src="styles/legend/_11_6.png" /> Ущелья и каньоны<br />' });
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

lyr_ESRIWorldTopo_0.setVisible(false);lyr_satelitegooglemaps_1.setVisible(false);lyr_OpenStreetMap_2.setVisible(true);lyr_maska_3.setVisible(true);lyr___4.setVisible(true);lyr___5.setVisible(true);lyr__6.setVisible(true);lyr__7.setVisible(true);lyr__8.setVisible(true);lyr___9.setVisible(true);lyr__10.setVisible(true);lyr__11.setVisible(true);lyr__12.setVisible(true);
var layersList = [lyr_ESRIWorldTopo_0,lyr_satelitegooglemaps_1,lyr_OpenStreetMap_2,lyr_maska_3,lyr___4,lyr___5,lyr__6,lyr__7,lyr__8,lyr___9,lyr__10,lyr__11,lyr__12];
lyr_maska_3.set('fieldAliases', {'fid': 'fid', 'OBJECTID_1': 'OBJECTID_1', 'OBJECTID': 'OBJECTID', 'Name': 'Name', 'Shape_Leng': 'Shape_Leng', 'Shape_Le_1': 'Shape_Le_1', 'Shape_Area': 'Shape_Area', });
lyr___4.set('fieldAliases', {'fid': 'fid', 'OBJECTID': 'OBJECTID', 'Shape_Leng': 'Shape_Leng', 'Shape_Area': 'Shape_Area', });
lyr___5.set('fieldAliases', {'fid': 'fid', 'OBJECTID': 'OBJECTID', 'Shape_Leng': 'Shape_Leng', 'Shape_Area': 'Shape_Area', });
lyr__6.set('fieldAliases', {'fid': 'fid', 'ЦОН': 'ЦОН', 'Адрес': 'Адрес', 'Режим': 'Режим', });
lyr__7.set('fieldAliases', {'fid': 'fid', 'name_kgz': 'name_kgz', 'name_en': 'name_en', 'name_ru': 'name_ru', });
lyr__8.set('fieldAliases', {'fid': 'fid', 'name_en': 'name_en', 'name_ru': 'name_ru', 'name_ky': 'name_ky', });
lyr___9.set('fieldAliases', {'fid': 'fid', 'OBJECTID_1': 'OBJECTID_1', 'Name': 'Name', 'Shape_Leng': 'Shape_Leng', });
lyr__10.set('fieldAliases', {'fid': 'fid', 'OBJECTID_1': 'OBJECTID_1', 'Name_ru': 'Name_ru', 'Name_en': 'Name_en', 'СОАТЕ': 'СОАТЕ', 'Pop_2018': 'Pop_2018', 'Name_kg': 'Name_kg', 'type': 'type', });
lyr__11.set('fieldAliases', {'fid': 'fid', 'Name': 'Name', 'Type': 'Type', });
lyr__12.set('fieldAliases', {'fid': 'fid', 'name_kg': 'name_kg', 'location': 'location', 'mode': 'mode', });
lyr_maska_3.set('fieldImages', {'fid': '', 'OBJECTID_1': 'TextEdit', 'OBJECTID': 'TextEdit', 'Name': 'TextEdit', 'Shape_Leng': 'TextEdit', 'Shape_Le_1': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr___4.set('fieldImages', {'fid': '', 'OBJECTID': 'TextEdit', 'Shape_Leng': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr___5.set('fieldImages', {'fid': '', 'OBJECTID': 'TextEdit', 'Shape_Leng': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr__6.set('fieldImages', {'fid': '', 'ЦОН': 'TextEdit', 'Адрес': 'TextEdit', 'Режим': 'TextEdit', });
lyr__7.set('fieldImages', {'fid': '', 'name_kgz': 'TextEdit', 'name_en': 'TextEdit', 'name_ru': 'TextEdit', });
lyr__8.set('fieldImages', {'fid': '', 'name_en': 'TextEdit', 'name_ru': 'TextEdit', 'name_ky': 'TextEdit', });
lyr___9.set('fieldImages', {'fid': '', 'OBJECTID_1': 'TextEdit', 'Name': 'TextEdit', 'Shape_Leng': 'TextEdit', });
lyr__10.set('fieldImages', {'fid': 'TextEdit', 'OBJECTID_1': 'TextEdit', 'Name_ru': 'TextEdit', 'Name_en': 'TextEdit', 'СОАТЕ': 'TextEdit', 'Pop_2018': 'TextEdit', 'Name_kg': 'TextEdit', 'type': 'TextEdit', });
lyr__11.set('fieldImages', {'fid': '', 'Name': 'TextEdit', 'Type': 'TextEdit', });
lyr__12.set('fieldImages', {'fid': 'TextEdit', 'name_kg': 'TextEdit', 'location': 'TextEdit', 'mode': 'TextEdit', });
lyr_maska_3.set('fieldLabels', {'fid': 'no label', 'OBJECTID_1': 'no label', 'OBJECTID': 'no label', 'Name': 'no label', 'Shape_Leng': 'no label', 'Shape_Le_1': 'no label', 'Shape_Area': 'no label', });
lyr___4.set('fieldLabels', {'fid': 'hidden field', 'OBJECTID': 'no label', 'Shape_Leng': 'no label', 'Shape_Area': 'no label', });
lyr___5.set('fieldLabels', {'fid': 'no label', 'OBJECTID': 'no label', 'Shape_Leng': 'no label', 'Shape_Area': 'no label', });
lyr__6.set('fieldLabels', {'fid': 'hidden field', 'ЦОН': 'no label', 'Адрес': 'no label', 'Режим': 'no label', });
lyr__7.set('fieldLabels', {'fid': 'no label', 'name_kgz': 'no label', 'name_en': 'no label', 'name_ru': 'no label', });
lyr__8.set('fieldLabels', {'fid': 'no label', 'name_en': 'no label', 'name_ru': 'no label', 'name_ky': 'no label', });
lyr___9.set('fieldLabels', {'fid': 'no label', 'OBJECTID_1': 'no label', 'Name': 'no label', 'Shape_Leng': 'no label', });
lyr__10.set('fieldLabels', {'fid': 'no label', 'OBJECTID_1': 'no label', 'Name_ru': 'no label', 'Name_en': 'no label', 'СОАТЕ': 'no label', 'Pop_2018': 'no label', 'Name_kg': 'no label', 'type': 'no label', });
lyr__11.set('fieldLabels', {'fid': 'hidden field', 'Name': 'no label', 'Type': 'no label', });
lyr__12.set('fieldLabels', {'fid': 'hidden field', 'name_kg': 'no label', 'location': 'no label', 'mode': 'no label', });
lyr__12.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});