ol.proj.proj4.register(proj4);
//ol.proj.get("EPSG:32643").setExtent([-187361.531007, 4117544.723272, 1163233.952066, 5049386.581270]);
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
               /* title: '<img src="styles/legend/maska_3.png" /> maska'*/
            });
var format_borderband_4 = new ol.format.GeoJSON();
var features_borderband_4 = format_borderband_4.readFeatures(json_borderband_4, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource_borderband_4 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_borderband_4.addFeatures(features_borderband_4);
var lyr_borderband_4 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_borderband_4, 
                style: style_borderband_4,
                popuplayertitle: 'border band',
                interactive: false,
                title: '<img src="styles/legend/borderband_4.png" /> border band'
            });
var format_BorderTerritory_5 = new ol.format.GeoJSON();
var features_BorderTerritory_5 = format_BorderTerritory_5.readFeatures(json_BorderTerritory_5, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource_BorderTerritory_5 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_BorderTerritory_5.addFeatures(features_BorderTerritory_5);
var lyr_BorderTerritory_5 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_BorderTerritory_5, 
                style: style_BorderTerritory_5,
                popuplayertitle: 'Border Territory',
                interactive: false,
                title: '<img src="styles/legend/BorderTerritory_5.png" /> Border Territory'
            });
var format_Population_Service_Center_6 = new ol.format.GeoJSON();
var features_Population_Service_Center_6 = format_Population_Service_Center_6.readFeatures(json_Population_Service_Center_6, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource_Population_Service_Center_6 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Population_Service_Center_6.addFeatures(features_Population_Service_Center_6);
cluster_Population_Service_Center_6 = new ol.source.Cluster({
  distance: 30,
  source: jsonSource_Population_Service_Center_6
});
var lyr_Population_Service_Center_6 = new ol.layer.Vector({
                declutter: false,
                source:cluster_Population_Service_Center_6, 
                style: style_Population_Service_Center_6,
                popuplayertitle: 'Population_Service_Center',
                interactive: true,
                title: '<img src="styles/legend/Population_Service_Center_6.png" /> Population_Service_Center'
            });
var format_yilaimaks_7 = new ol.format.GeoJSON();
var features_yilaimaks_7 = format_yilaimaks_7.readFeatures(json_yilaimaks_7, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource_yilaimaks_7 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_yilaimaks_7.addFeatures(features_yilaimaks_7);
var lyr_yilaimaks_7 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_yilaimaks_7,
maxResolution:56.00893230452392,
 
                style: style_yilaimaks_7,
                popuplayertitle: 'Аyil aimaks',
                interactive: false,
                title: '<img src="styles/legend/yilaimaks_7.png" /> Аyil aimaks'
            });
var format_Districts_8 = new ol.format.GeoJSON();
var features_Districts_8 = format_Districts_8.readFeatures(json_Districts_8, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource_Districts_8 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Districts_8.addFeatures(features_Districts_8);
var lyr_Districts_8 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Districts_8,
maxResolution:280.0446615226196,
 minResolution:42.00669922839295,

                style: style_Districts_8,
                popuplayertitle: 'Districts',
                interactive: false,
                title: '<img src="styles/legend/Districts_8.png" /> Districts'
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
var format_Settlements_10 = new ol.format.GeoJSON();
var features_Settlements_10 = format_Settlements_10.readFeatures(json_Settlements_10, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource_Settlements_10 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Settlements_10.addFeatures(features_Settlements_10);
var lyr_Settlements_10 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Settlements_10,
maxResolution:152.3442958683051,
 
                style: style_Settlements_10,
                popuplayertitle: 'Settlements',
                interactive: false,
    title: 'Settlements<br />\
    <img src="styles/legend/Settlements_10_0.png" /> Capital<br />\
    <img src="styles/legend/Settlements_10_1.png" /> Regional centers<br />\
    <img src="styles/legend/Settlements_10_2.png" /> Settlements > 10,000<br />\
    <img src="styles/legend/Settlements_10_3.png" /> Settlements < 10,000<br />' });
var format_Attractions_11 = new ol.format.GeoJSON();
var features_Attractions_11 = format_Attractions_11.readFeatures(json_Attractions_11, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource_Attractions_11 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Attractions_11.addFeatures(features_Attractions_11);
cluster_Attractions_11 = new ol.source.Cluster({
  distance: 30,
  source: jsonSource_Attractions_11
});
var lyr_Attractions_11 = new ol.layer.Vector({
                declutter: false,
                source:cluster_Attractions_11, 
                style: style_Attractions_11,
                popuplayertitle: 'Attractions',
                interactive: true,
    title: 'Attractions<br />\
    <img src="styles/legend/Attractions_11_0.png" /> Cities<br />\
    <img src="styles/legend/Attractions_11_1.png" /> Culture<br />\
    <img src="styles/legend/Attractions_11_2.png" /> Gorges and canyons<br />\
    <img src="styles/legend/Attractions_11_3.png" /> Lake<br />\
    <img src="styles/legend/Attractions_11_4.png" /> Mountains<br />\
    <img src="styles/legend/Attractions_11_5.png" /> Parks and Reserves<br />\
    <img src="styles/legend/Attractions_11_6.png" /> Passes and valleys<br />' });
var format_Checkpoint_12 = new ol.format.GeoJSON();
var features_Checkpoint_12 = format_Checkpoint_12.readFeatures(json_Checkpoint_12, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32643'});
var jsonSource_Checkpoint_12 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Checkpoint_12.addFeatures(features_Checkpoint_12);
cluster_Checkpoint_12 = new ol.source.Cluster({
  distance: 30,
  source: jsonSource_Checkpoint_12
});
var lyr_Checkpoint_12 = new ol.layer.Vector({
                declutter: false,
                source:cluster_Checkpoint_12, 
                style: style_Checkpoint_12,
                popuplayertitle: 'Checkpoint',
                interactive: true,
                title: '<img src="styles/legend/Checkpoint_12.png" /> Checkpoint',
            });

lyr_ESRIWorldTopo_0.setVisible(true);lyr_satelitegooglemaps_1.setVisible(false);lyr_OpenStreetMap_2.setVisible(false);lyr_maska_3.setVisible(false);lyr_borderband_4.setVisible(true);lyr_BorderTerritory_5.setVisible(true);lyr_Population_Service_Center_6.setVisible(true);lyr_yilaimaks_7.setVisible(true);lyr_Districts_8.setVisible(true);lyr___9.setVisible(true);lyr_Settlements_10.setVisible(true);lyr_Attractions_11.setVisible(true);lyr_Checkpoint_12.setVisible(true);
var layersList = [lyr_ESRIWorldTopo_0,lyr_satelitegooglemaps_1,lyr_OpenStreetMap_2,lyr_maska_3,lyr_borderband_4,lyr_BorderTerritory_5,lyr_Population_Service_Center_6,lyr_yilaimaks_7,lyr_Districts_8,lyr___9,lyr_Settlements_10,lyr_Attractions_11,lyr_Checkpoint_12];
lyr_maska_3.set('fieldAliases', {'fid': 'fid', 'OBJECTID_1': 'OBJECTID_1', 'OBJECTID': 'OBJECTID', 'Name': 'Name', 'Shape_Leng': 'Shape_Leng', 'Shape_Le_1': 'Shape_Le_1', 'Shape_Area': 'Shape_Area', });
lyr_borderband_4.set('fieldAliases', {'fid': 'fid', 'OBJECTID': 'OBJECTID', 'Shape_Leng': 'Shape_Leng', 'Shape_Area': 'Shape_Area', });
lyr_BorderTerritory_5.set('fieldAliases', {'fid': 'fid', 'OBJECTID': 'OBJECTID', 'Shape_Leng': 'Shape_Leng', 'Shape_Area': 'Shape_Area', });
lyr_Population_Service_Center_6.set('fieldAliases', {'fid': 'fid', 'ЦОН': 'ЦОН', 'Адрес': 'Адрес', 'Режим': 'Режим', });
lyr_yilaimaks_7.set('fieldAliases', {'fid': 'fid', 'name_kgz': 'name_kgz', 'name_en': 'name_en', 'name_ru': 'name_ru', });
lyr_Districts_8.set('fieldAliases', {'fid': 'fid', 'name_en': 'name_en', 'name_ru': 'name_ru', 'name_ky': 'name_ky', });
lyr___9.set('fieldAliases', {'fid': 'fid', 'OBJECTID_1': 'OBJECTID_1', 'Name': 'Name', 'Shape_Leng': 'Shape_Leng', });
lyr_Settlements_10.set('fieldAliases', {'fid': 'fid', 'OBJECTID_1': 'OBJECTID_1', 'Name_ru': 'Name_ru', 'Name_en': 'Name_en', 'СОАТЕ': 'СОАТЕ', 'Pop_2018': 'Pop_2018', 'Name_kg': 'Name_kg', 'type': 'type', });
lyr_Attractions_11.set('fieldAliases', {'fid': 'fid', 'Name': 'Name', 'Type': 'Type', });
lyr_Checkpoint_12.set('fieldAliases', {'fid': 'fid', 'fid_': 'fid_', 'name_kg': 'name_kg', 'location': 'location', 'mode': 'mode', });
lyr_maska_3.set('fieldImages', {'fid': '', 'OBJECTID_1': 'TextEdit', 'OBJECTID': 'TextEdit', 'Name': 'TextEdit', 'Shape_Leng': 'TextEdit', 'Shape_Le_1': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr_borderband_4.set('fieldImages', {'fid': '', 'OBJECTID': 'TextEdit', 'Shape_Leng': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr_BorderTerritory_5.set('fieldImages', {'fid': '', 'OBJECTID': 'TextEdit', 'Shape_Leng': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr_Population_Service_Center_6.set('fieldImages', {'fid': '', 'ЦОН': 'TextEdit', 'Адрес': 'TextEdit', 'Режим': 'TextEdit', });
lyr_yilaimaks_7.set('fieldImages', {'fid': 'TextEdit', 'name_kgz': 'TextEdit', 'name_en': 'TextEdit', 'name_ru': 'TextEdit', });
lyr_Districts_8.set('fieldImages', {'fid': 'TextEdit', 'name_en': 'TextEdit', 'name_ru': 'TextEdit', 'name_ky': 'TextEdit', });
lyr___9.set('fieldImages', {'fid': '', 'OBJECTID_1': 'TextEdit', 'Name': 'TextEdit', 'Shape_Leng': 'TextEdit', });
lyr_Settlements_10.set('fieldImages', {'fid': 'TextEdit', 'OBJECTID_1': 'TextEdit', 'Name_ru': 'TextEdit', 'Name_en': 'TextEdit', 'СОАТЕ': 'TextEdit', 'Pop_2018': 'TextEdit', 'Name_kg': 'TextEdit', 'type': 'TextEdit', });
lyr_Attractions_11.set('fieldImages', {'fid': 'TextEdit', 'Name': 'TextEdit', 'Type': 'TextEdit', });
lyr_Checkpoint_12.set('fieldImages', {'fid': 'TextEdit', 'fid_': '', 'name_kg': 'TextEdit', 'location': 'TextEdit', 'mode': 'TextEdit', });
lyr_maska_3.set('fieldLabels', {'fid': 'no label', 'OBJECTID_1': 'no label', 'OBJECTID': 'no label', 'Name': 'no label', 'Shape_Leng': 'no label', 'Shape_Le_1': 'no label', 'Shape_Area': 'no label', });
lyr_borderband_4.set('fieldLabels', {'fid': 'no label', 'OBJECTID': 'no label', 'Shape_Leng': 'no label', 'Shape_Area': 'inline label - visible with data', });
lyr_BorderTerritory_5.set('fieldLabels', {'fid': 'no label', 'OBJECTID': 'no label', 'Shape_Leng': 'no label', 'Shape_Area': 'no label', });
lyr_Population_Service_Center_6.set('fieldLabels', {'fid': 'hidden field', 'ЦОН': 'no label', 'Адрес': 'no label', 'Режим': 'no label', });
lyr_yilaimaks_7.set('fieldLabels', {'fid': 'no label', 'name_kgz': 'no label', 'name_en': 'no label', 'name_ru': 'no label', });
lyr_Districts_8.set('fieldLabels', {'fid': 'no label', 'name_en': 'no label', 'name_ru': 'no label', 'name_ky': 'no label', });
lyr___9.set('fieldLabels', {'fid': 'no label', 'OBJECTID_1': 'no label', 'Name': 'no label', 'Shape_Leng': 'no label', });
lyr_Settlements_10.set('fieldLabels', {'fid': 'no label', 'OBJECTID_1': 'no label', 'Name_ru': 'no label', 'Name_en': 'no label', 'СОАТЕ': 'no label', 'Pop_2018': 'no label', 'Name_kg': 'no label', 'type': 'no label', });
lyr_Attractions_11.set('fieldLabels', {'fid': 'hidden field', 'Name': 'no label', 'Type': 'no label', });
lyr_Checkpoint_12.set('fieldLabels', {'fid': 'hidden field', 'fid_': 'hidden field', 'name_kg': 'no label', 'location': 'no label', 'mode': 'no label', });
lyr_Checkpoint_12.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});