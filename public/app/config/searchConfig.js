(function() {

    "use strict";

    define([
        "esri/tasks/locator",
        "esri/geometry/Extent",
        "esri/layers/FeatureLayer"
    ], function(Locator, Extent, FeatureLayer) {

        var searchConfig = new function() {
            var self = this;
            // console.log(appConfig.layerInfo[1].queryUrl);

            self.Sources = [{
                locator: new Locator(appConfig.geoCoderService),
                singleLineFieldName: "SingleLine",
                autoNavigate: true,
                enableInfoWindow: true,
                enableHighlight: false,
                autoSelect: false,
                showInfoWindowOnSelect: true,
                name: "Map",
                searchExtent: new Extent({
                    "xmin": -114.68,
                    "ymin": 31.29,
                    "xmax": -109.06,
                    "ymax": 36.99
                }),
                placeholder: "302 N 1st Ave, Phoenix, Arizona"
            }, {
                featureLayer: new FeatureLayer(appConfig.layerInfo[1].queryUrl),
                searchFields: ["NAME"],
                displayField: "NAME",
                outFields: ["*"],
                name: "Counties",
                placeholder: "Pinal County"
            }, {
                featureLayer: new FeatureLayer(appConfig.layerInfo[2].queryUrl),
                searchFields: ["BdName"],
                displayField: "BdName",
                outFields: ["*"],
                name: "Supervisorial Districts",
                placeholder: "Supervisorial District 2"
            }, {
                featureLayer: new FeatureLayer(appConfig.placeService),
                searchFields: ["NAME10"],
                displayField: "NAME10",
                outFields: ["*"],
                name: "City/Town",
                placeholder: "Scottsdale"
            }, {
                featureLayer: new FeatureLayer(appConfig.layerInfo[3].queryUrl),
                searchFields: ["WARD"],
                displayField: "WARD",
                outFields: ["*"],
                name: "Council Districts",
                placeholder: "Glendale District 2 - Sahuaro"
            }, {
                featureLayer: new FeatureLayer(appConfig.censusTracts),
                searchFields: ["NAMELSAD10"],
                displayField: "NAMELSAD10",
                outFields: ["*"],
                autoNavigate: true,
                name: "Census Tracts",
                placeholder: "Census Tract 8.03"
            }];
        };
        return searchConfig;
    });
}());