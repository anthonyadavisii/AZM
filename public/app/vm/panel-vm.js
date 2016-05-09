/**
 * Panel div used to launch various reports
 *
 * @class panel-vm
 */

(function() {

    "use strict";

    define([
            "dojo",
            "dojo/dom-construct",
            "dojo/topic",
            "dojo/dom",
            "app/models/map-model",
            "dojo/text!app/views/panelHelp-view.html",
            "app/vm/help-vm",
            "dojo/text!app/views/panel-view.html",
            "app/helpers/layer-delegate",
            "app/vm/demographic-vm",
            "app/config/demographicConfig",
            "app/vm/interactiveTools-vm",
            "app/vm/queryBuilder-vm"
        ],
        function(dj, dc, tp, dom, mapModel, helpView, helpVM, view, layerDelegate, demographicVM, demographicConfig, interactiveToolsVM, qbVM) {

            var PanelVM = new function() {

                /**
                 * Store reference to module this object.
                 *
                 * @property self
                 * @type {*}
                 */
                var self = this;

                // detects html window size
                self.winWidth = document.documentElement.clientWidth;
                self.winHeight = document.documentElement.clientHeight;
                // console.log("Height: " + self.winHeight + " & " + "Width: " + self.winWidth);
                self.newWindowWidth = self.winWidth;
                self.winVisible = true;

                if (self.winWidth <= 668) {
                    self.newWindowWidth = "210px";
                    self.winVisible = false;
                    self.winLocation = 440;
                } else if (self.winWidth <= 800) {
                    self.newWindowWidth = "210px";
                    self.winVisible = false;
                    self.winLocation = 440;
                } else if (self.winWidth <= 1024) {
                    self.newWindowWidth = "210px";
                    self.winLocation = 430;
                } else if (self.winWidth <= 1200) {
                    self.newWindowWidth = "210px";
                    self.winLocation = 430;
                } else {
                    self.newWindowWidth = "250px";
                    self.winLocation = 510;
                }

                /**
                Title for the module's window

                @property windowTitle
                @type String
                **/
                self.windowTitle = "Reports";

                /**
                 * Initialize the class.
                 *
                 * @method init
                 */
                self.init = function() {
                    dc.place(view, "mapContainer", "after");

                    tp.subscribe("panelStateO", function() {
                        self.openWindow();
                    });
                    tp.subscribe("panelStateC", function() {
                        self.closeWindow();
                    });

                    var reportsWindow = $("#reportLauncher").kendoWindow({
                        width: self.newWindowWidth, //"250px"
                        height: "auto",
                        title: self.windowTitle,
                        actions: ["Help", "Minimize", "Close"],
                        modal: false,
                        visible: self.winVisible, //true
                        resizable: false
                    }).data("kendoWindow");

                    var helpButton = reportsWindow.wrapper.find(".k-i-help");
                    helpButton.click(function() {
                        helpVM.openWindow(helpView);
                    });

                    // Initial window placement
                    $("#reportLauncher").closest(".k-window").css({
                        top: 55,
                        // left: self.winWidth - self.winLocation
                        left: 330
                    });

                    // Hide the county div for now
                    $("#countyChoiceDiv").hide();
                    // Hide the places div for now
                    $("#placeChoiceDiv").hide();
                    // Hide the supervisor div for now
                    $("#supervisorChoiceDiv").hide();
                    // Hide the council div for now
                    $("#councilChoiceDiv").hide();
                    // Hide the zipCodes div for now
                    $("#zipCodeChoiceDiv").hide();

                    // Load the county names
                    var url1 = demographicConfig.reports.countySummary.restUrl;
                    var whereClause1 = demographicConfig.reports.countySummary.whereClause;
                    layerDelegate.query(url1, self.countyQueryHandler, self.countyQueryFault, null, whereClause1, false);
                    qbVM.init("display", "after");

                    // Load the place names
                    var url2 = demographicConfig.reports.placeSummary.restUrl;
                    var whereClause2 = demographicConfig.reports.placeSummary.whereClause;
                    layerDelegate.query(url2, self.placeQueryHandler, self.placeQueryFault, null, whereClause2, false);


                    // Load the supervisor names
                    var url3 = demographicConfig.reports.supervisorSummary.restUrl;
                    var whereClause3 = demographicConfig.reports.supervisorSummary.whereClause;
                    layerDelegate.query(url3, self.supervisorQueryHandler, self.supervisorQueryFault, null, whereClause3, false);


                    // Load the council names
                    var url4 = demographicConfig.reports.councilSummary.restUrl;
                    var whereClause4 = demographicConfig.reports.councilSummary.whereClause;
                    layerDelegate.query(url4, self.councilQueryHandler, self.councilQueryFault, null, whereClause4, false);


                     // Load the zip codes
                    var url5 = demographicConfig.reports.zipCodeSummary.restUrl;
                    var whereClause = demographicConfig.reports.zipCodeSummary.whereClause;
                    layerDelegate.query(url5, self.zipCodeQueryHandler, self.zipCodeQueryFault, null, whereClause, false);

                }; //end init

                /**
                Method for opening the window.

                @method openWindow
                **/
                self.openWindow = function() {
                    var win = $("#reportLauncher").data("kendoWindow");
                    win.restore();
                    win.open();

                    $("#reportLauncher").closest(".k-window").css({
                        top: 55,
                        // left: self.winWidth - self.winLocation
                        left: 330
                    });
                };
                /**
                Method for closing the window.

                @method closeWindow
                **/
                self.closeWindow = function() {
                    var win = $("#reportLauncher").data("kendoWindow");
                    win.close();
                };

                // change window location when window resized
                self.winResize = function() {
                    self.winWidth = document.documentElement.clientWidth;
                    self.winHeight = document.documentElement.clientHeight;

                    $("#reportLauncher").closest(".k-window").css({
                        top: 55,
                        // left: self.winWidth - self.winLocation
                        left: 330
                    });
                };

                var resizeTimer;
                $(window).resize(function() {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(self.winResize, 200);
                });

                /**
                 * Callback method for errors returned by county query.
                 *
                 * @method countyQueryFault
                 * @param {Error} error - error object
                 */
                self.countyQueryFault = function(error) {
                    console.log(error.message);
                };

                /**
                 * Callback method for results returned by county query.
                 *
                 * @method countyQueryHelper
                 * @param {FeatureSet} results - feature set returned by query.
                 */
                self.countyQueryHandler = function(results) {
                    var features = results.features;

                    var nameArray = [];
                    var countyField = demographicConfig.reports.countySummary.summaryField;
                    $.each(features, function(index, feature) {
                        var name = feature.attributes[countyField];
                        nameArray.push({
                            Name: name
                        });
                    });

                    $("#countyComboBox").kendoComboBox({
                        index: 0,
                        dataTextField: "Name",
                        dataValueField: "Name",
                        filter: "contains",
                        dataSource: {
                            data: nameArray
                        }
                    });

                };

                /**
                 * Callback method for errors returned by place query.
                 *
                 * @method placeQueryFault
                 * @param {Error} error - error object
                 */
                self.placeQueryFault = function(error) {
                    console.log(error.message);
                };

                /**
                 * Callback method for results returned by place query.
                 *
                 * @method placeQueryHelper
                 * @param {FeatureSet} results - feature set returned by query.
                 */
                self.placeQueryHandler = function(results) {
                    var features = results.features;

                    var nameArray = [];
                    var placeField = demographicConfig.reports.placeSummary.summaryField;
                    $.each(features, function(index, feature) {
                        var name = feature.attributes[placeField];
                        nameArray.push({
                            Name: name
                        });
                    });
                    // used to sort attributes and put into Array. vw
                    function compare(a, b) {
                        if (a.Name < b.Name) {
                            return -1;
                        }
                        if (a.Name > b.Name) {
                            return 1;
                        }
                        return 0;
                    }
                    nameArray.sort(compare);

                    $("#placeComboBox").kendoComboBox({
                        index: 0,
                        dataTextField: "Name",
                        dataValueField: "Name",
                        filter: "contains",
                        dataSource: {
                            data: nameArray
                        }
                    });
                };

                /**
                 * Callback method for errors returned by zipCode query.
                 *
                 * @method zipCodeQueryFault
                 * @param {Error} error - error object
                 */
                self.zipCodeQueryFault = function(error) {
                    console.log(error.message);
                };

                /**
                 * Callback method for results returned by zip code query.
                 *
                 * @method zipCodeQueryHandler
                 * @param {FeatureSet} results - feature set returned by query.
                 */
                self.zipCodeQueryHandler = function(results) {
                    var features = results.features;

                    var nameArray = [];
                    var zipCodeField = demographicConfig.reports.zipCodeSummary.summaryField;
                    var zipID = demographicConfig.reports.zipCodeSummary.summaryID;
                    $.each(features, function(index, feature) {
                        var name = feature.attributes[zipCodeField];
                        var zipCodeID = feature.attributes[zipID];
                        nameArray.push({
                            Name: name,
                            ID: zipCodeID
                        });
                    });
                    // used to sort attributes and put into Array. vw
                    function compare(a, b) {
                        if (a.Name < b.Name) {
                            return -1;
                        }
                        if (a.Name > b.Name) {
                            return 1;
                        }
                        return 0;
                    }
                    nameArray.sort(compare);

                    $("#zipCodeComboBox").kendoComboBox({
                        index: 0,
                        dataTextField: "Name",
                        dataValueField: "ID",
                        filter: "contains",
                        dataSource: {
                            data: nameArray
                        }
                    });
                };

                /**
                 * Get the selected place name and call open method on employmentVM.
                 *
                 * @event click
                 */
                self.openZipCodeSummaryWindow = function() {
                    // Get the place name selected
                    var selectedZipCode = $("#zipCodeComboBox").data("kendoComboBox").dataItem();
                    var zipCode = selectedZipCode.ID;
                    demographicVM.openWindow(zipCode, "zip");
                };

                /**
                 * Show/Hide div containing jobs combo box.
                 *
                 * @event click
                 */
                self.displayZipCodeChoice = function() {
                    var layer = mapModel.mapInstance.getLayer("zipcodes");

                    if ($("#zipCodeChoiceDiv").is(":hidden")) {
                        $("#zipCodeChoiceDiv").show();
                        $("#countyChoiceDiv, #placeChoiceDiv, #empInteractiveDiv").hide();

                        if (layer.visible === false) {
                            layer.show();
                        }

                    } else {
                        $("#zipCodeChoiceDiv").hide();
                        if (layer.visible === true) {
                            layer.hide();
                        }
                    }
                };

                /**
                 * Callback method for errors returned by supervisor query.
                 *
                 * @method supervisorQueryFault
                 * @param {Error} error - error object
                 */
                self.QueryFault = function(error) {
                    console.log(error.message);
                };

                /**
                 * Callback method for results returned by supervisor query.
                 *
                 * @method supervisorQueryHelper
                 * @param {FeatureSet} results - feature set returned by query.
                 */
                self.supervisorQueryHandler = function(results) {
                    var features = results.features;

                    var nameArray = [];
                    var supervisorField = demographicConfig.reports.supervisorSummary.summaryField;
                    $.each(features, function(index, feature) {
                        var name = feature.attributes[supervisorField];
                        nameArray.push({
                            Name: name
                        });
                    });
                    // used to sort attributes and put into Array. vw
                    function compare(a, b) {
                        if (a.Name < b.Name) {
                            return -1;
                        }
                        if (a.Name > b.Name) {
                            return 1;
                        }
                        return 0;
                    }
                    nameArray.sort(compare);

                    $("#supervisorComboBox").kendoComboBox({
                        index: 0,
                        dataTextField: "Name",
                        dataValueField: "Name",
                        filter: "contains",
                        dataSource: {
                            data: nameArray
                        }
                    });
                };

                /**
                 * Callback method for results returned by council query.
                 *
                 * @method councilQueryHelper
                 * @param {FeatureSet} results - feature set returned by query.
                 */
                self.councilQueryHandler = function(results) {
                    var features = results.features;

                    var nameArray = [];
                    var councilField = demographicConfig.reports.councilSummary.summaryField;
                    $.each(features, function(index, feature) {
                        var name = feature.attributes[councilField];
                        nameArray.push({
                            Name: name
                        });
                    });
                    // used to sort attributes and put into Array. vw
                    function compare(a, b) {
                        if (a.Name < b.Name) {
                            return -1;
                        }
                        if (a.Name > b.Name) {
                            return 1;
                        }
                        return 0;
                    }
                    nameArray.sort(compare);

                    $("#councilComboBox").kendoComboBox({
                        index: 0,
                        dataTextField: "Name",
                        dataValueField: "Name",
                        filter: "contains",
                        dataSource: {
                            data: nameArray
                        }
                    });
                };

                /**
                 * Show/Hide div containing county combo box.
                 *
                 * @event click
                 */
                self.displayCountyChoice = function() {
                    if ($("#countyChoiceDiv").is(":hidden")) {
                        $("#countyChoiceDiv").show();
                        $("#placeChoiceDiv, #demInteractiveDiv, #supervisorChoiceDiv, #councilChoiceDiv").hide();
                    } else {
                        $("#countyChoiceDiv").hide();
                    }
                };

                /**
                 * Show/Hide div containing place combo box.
                 *
                 * @event click
                 */
                self.displayPlaceChoice = function() {
                    var layer = mapModel.mapInstance.getLayer("place");
                    var boxChecked = dom.byId("cplace").checked;
                    if ($("#placeChoiceDiv").is(":hidden")) {
                        $("#placeChoiceDiv").show();
                        $("#countyChoiceDiv, #demInteractiveDiv, #supervisorChoiceDiv, #councilChoiceDiv").hide();
                        // used to turn on and off layer in the layer options.
                        // turns on the Supervisor Districts
                        if (layer.visible === false && boxChecked === false) {
                            layer.show();
                            dom.byId("cplace").checked = true;
                        }
                    } else {
                        $("#placeChoiceDiv").hide();
                        if (layer.visible === true && boxChecked === true) {
                            layer.hide();
                            dom.byId("cplace").checked = false;
                        }
                    }
                };

                /**
                 * Show/Hide div containing supervisor combo box.
                 *
                 * @event click
                 */
                self.displaySupervisorChoice = function() {
                    var layer = mapModel.mapInstance.getLayer("mcSupervisorDistricts");
                    var boxChecked = dom.byId("cmcSupervisorDistricts").checked;
                    var councilLayer = mapModel.mapInstance.getLayer("mcCouncilDistricts");
                    if ($("#supervisorChoiceDiv").is(":hidden")) {
                        $("#supervisorChoiceDiv").show();
                        $("#countyChoiceDiv, #demInteractiveDiv, #placeChoiceDiv, #councilChoiceDiv").hide();
                        // used to turn on and off layer in the layer options.
                        // turns on the Supervisor Districts
                        if (layer.visible === false && boxChecked === false) {
                            layer.show();
                            dom.byId("cmcSupervisorDistricts").checked = true;
                            councilLayer.hide();
                            dom.byId("cmcCouncilDistricts").checked = false;
                        }
                    } else {
                        $("#supervisorChoiceDiv").hide();

                        if (layer.visible === true && boxChecked === true) {
                            layer.hide();
                            dom.byId("cmcSupervisorDistricts").checked = false;
                        }
                    }
                };

                /**
                 * Show/Hide div containing council combo box.
                 *
                 * @event click
                 */
                self.displayCouncilChoice = function() {
                    var layer = mapModel.mapInstance.getLayer("mcCouncilDistricts");
                    var boxChecked = dom.byId("cmcCouncilDistricts").checked;
                    var supervisorlayer = mapModel.mapInstance.getLayer("mcSupervisorDistricts");
                    if ($("#councilChoiceDiv").is(":hidden")) {
                        $("#councilChoiceDiv").show();
                        $("#countyChoiceDiv, #demInteractiveDiv, #placeChoiceDiv, #supervisorChoiceDiv").hide();
                        // used to turn on and off layer in the layer options.
                        // turns on the Supervisor Districts
                        if (layer.visible === false && boxChecked === false) {
                            layer.show();
                            dom.byId("cmcCouncilDistricts").checked = true;
                            supervisorlayer.hide();
                            dom.byId("cmcSupervisorDistricts").checked = false;
                        }
                    } else {
                        $("#councilChoiceDiv").hide();
                        if (layer.visible === true && boxChecked === true) {
                            layer.hide();
                            dom.byId("cmcCouncilDistricts").checked = false;
                        }
                    }
                };


                /**
                 * Get the selected county name and call open method on demographicVM.
                 *
                 * @event click
                 */
                self.openCountySummaryWindow = function() {
                    // Get the place name selected
                    var selectedName = $("#countyComboBox").data("kendoComboBox").dataItem();
                    var countyName = selectedName.Name;

                    // Open the window
                    demographicVM.openWindow(countyName, "county");
                };

                /**
                 * Get the selected place name and call open method on demographicVM.
                 *
                 * @event click
                 */
                self.openPlaceSummaryWindow = function() {
                    // Get the place name selected
                    var selectedName = $("#placeComboBox").data("kendoComboBox").dataItem();
                    var placeName = selectedName.Name;

                    // Open the window
                    demographicVM.openWindow(placeName, "place");
                };

                /**
                 * Get the selected place name and call open method on demographicVM.
                 *
                 * @event click
                 */
                self.openSupervisorSummaryWindow = function() {
                    // Get the place name selected
                    var selectedName = $("#supervisorComboBox").data("kendoComboBox").dataItem();
                    var supervisorName = selectedName.Name;

                    // Open the window
                    demographicVM.openWindow(supervisorName, "supervisor");
                };

                /**
                 * Get the selected place name and call open method on demographicVM.
                 *
                 * @event click
                 */
                self.openCouncilSummaryWindow = function() {
                    // Get the place name selected
                    var selectedName = $("#councilComboBox").data("kendoComboBox").dataItem();
                    var councilName = selectedName.Name;

                    // Open the window
                    demographicVM.openWindow(councilName, "council");
                };

                /**
                 * Show/Hide div containing interactive tools.
                 *
                 * @event click
                 */
                self.displayInteractiveDiv = function() {
                    var div = $("#demInteractiveDiv");

                    if (div.length === 0) {
                        interactiveToolsVM.insertAfter("demInteractiveDiv", "launchInteractiveSummaryDiv", demographicVM.interactiveSelectionQueryHandler, demographicVM.interactiveSelectionQueryFault, demographicConfig.reports.censusTracts.restUrl);
                    } else {
                        if (div.is(":hidden")) {
                            $("#demInteractiveDiv").show();
                            $("#countyChoiceDiv, #placeChoiceDiv, #supervisorChoiceDiv, #councilChoiceDiv").hide();
                        } else {
                            interactiveToolsVM.clearSelection();
                            $("#demInteractiveDiv").hide();
                        }
                    }
                };

                /**
                 * Open the query builder window.
                 *
                 * @event click
                 */
                self.openQueryBuilder = function() {
                    qbVM.openWindow();
                    $("#countyChoiceDiv, #placeChoiceDiv, #demInteractiveDiv, #supervisorChoiceDiv, #councilChoiceDiv").hide();
                };
            }; // End of PanelVM

            return PanelVM;

        }); // End function
}());