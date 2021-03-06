(function () {

    var areas = null;

    var ReportsService = function ($http, $q) {

        var baseUrl = 'http://diycm-api.azurewebsites.net/api/';
        //var baseUrl = 'http://localhost:49983/api/';

        var _getProject = function (id) {
            return $http.get(baseUrl + id)
             .then(function (response) {
                 return response.data;
             });
        };

        var _addProject = function (data) {
          $.support.cors = true;
           return $http.post(baseUrl + "Projects", data)
             .then(function (response) {
                 return response.data;
             });
       };

        var _getAllProjects = function () {
            return $http.get(baseUrl + "Projects")
              .then(function (response) {
                  return response.data;
              });
        };
        var _getAllQuoteHeaders = function () {
            return $http.get(baseUrl + "QuoteHeaders")
              .then(function (response) {
                  return response.data;
              });
        };


        //returns a JSON with project and summed up category budgets for the corresponding project -> charts?
        // | ProjectName | BudgetAmount | ActualAmount |
        var _getAllProjectsBudgetActual = function () {

            var reqProjects = $http.get(baseUrl + 'projects');
            var reqCategories = $http.get(baseUrl + 'categories');

            return $q.all([reqProjects, reqCategories]).then(function (values) {
                var projects = values[0].data;
                var categorybudgets = values[1].data;
                projects.forEach(function (project) {
                    var budgetSum = 0;
                    var actualSum = 0;
                    categorybudgets.forEach(function (budget) {
                        if (project.ProjectId == budget.ProjectId) {
                            budgetSum += budget.BudgetAmount;
                            actualSum += budget.ActualAmount;
                        }
                    });
                    project.BudgetAmount = budgetSum;
                    project.ActualAmount = actualSum;
                });
                return projects;
            });
        };

        //returns a JSON with all the information for categories details/summary
        //summary table
        // | ProjectName | CategoryName | BudgetAmount(cat) | ActualAmount(cat) | PercentCompleted |
        //details table
        // | ProjectName | CategoryName | BudgetAmount(cat) | ActualAmount(cat) | PercentCompleted | PartDesccription | PartUnitPrice | SupplierName |
        var _getCategoryDetailsAndSummary = function () {
            var reqCategories = $http.get(baseUrl + 'categories');
            var reqProjects = $http.get(baseUrl + 'projects');
            var reqQuoteDetails = $http.get(baseUrl + 'quotedetails');
            var regQuoteHeaders = $http.get(baseUrl + 'quoteheaders');

            return $q.all([reqCategories, reqProjects, reqQuoteDetails, regQuoteHeaders]).then(function (values) {
                var categories = values[0].data;
                var projects = values[1].data;
                var quotedetails = values[2].data;
                var quoteheaders = values[3].data;

                categories.forEach(function (category) {
                    category.ProjetName = '';
                    projects.forEach(function (project) {
                        if (project.ProjectId == category.ProjectId) {
                            category.ProjectId = project.ProjectId;
                            category.ProjectName = project.ProjectName;
                        }
                    });
                    quotedetails.forEach(function (detail) {
                        if (detail.CategoryId == category.CategoryId) {
                            category.QuoteHeaderId = detail.QuoteHeaderId;
                            category.PartId = detail.PartId;
                            category.PartUnitPrice = detail.UnitPrice;
                            category.PartDescription = detail.PartDescription;

                        }
                    });
                    quoteheaders.forEach(function (header) {
                        if (header.QuoteHeaderId = category.QuoteHeaderId) {
                            category.SupplierName = header.Supplier;
                        }
                    });
                });

                return categories;
            });
        };

        //returns a JSON with all the information for subcategories details/summmary
        //summary table
        // | ProjectName | CategoryName | SubCategoryName | BudgetAmount(subcat) | ActualAmount(subcat) | PercentCompleted |
        //details tablae
        // | ProjectName | CategoryName | SubCategoryName | PartDescription | PercentCompleted | PartUnitPrice | PercentDiscount | SupplierName |
        var _getSubCategoryDetailsAndSummary = function () {
            var reqSubCategories = $http.get(baseUrl + 'subcategories');
            var reqCategories = $http.get(baseUrl + 'categories');
            var reqProjects = $http.get(baseUrl + 'projects');
            var reqQuoteDetails = $http.get(baseUrl + 'quotedetails');
            var regQuoteHeaders = $http.get(baseUrl + 'quoteheaders');

            return $q.all([reqSubCategories, reqCategories, reqProjects, reqQuoteDetails, regQuoteHeaders]).then(function (values) {
                var subcategories = values[0].data;
                var categories = values[1].data;
                var projects = values[2].data;
                var quotedetails = values[3].data;
                var quoteheaders = values[4].data;

                subcategories.forEach(function (subcategory) {
                    categories.forEach(function (category) {
                        if (category.CategoryId == subcategory.CategoryId) {
                            subcategory.CategoryName = category.CategoryName;
                            subcategory.ProjectId = category.ProjectId;
                        }
                    });
                    projects.forEach(function (project) {
                        if (subcategory.ProjectId == project.ProjectId) {
                            subcategory.ProjectName = project.ProjectName;
                        }
                    });
                    quotedetails.forEach(function (detail) {
                        if (detail.SubCategoryId == subcategory.SubCategoryId) {
                            subcategory.QuoteHeaderId = detail.QuoteHeaderId;
                            subcategory.PartId = detail.PartId;
                            subcategory.PartUnitPrice = detail.UnitPrice;
                            subcategory.PartDescription = detail.PartDescription;
                        }
                    })
                    quoteheaders.forEach(function (header) {
                        if (subcategory.QuoteHeaderId == header.QuoteHeaderId) {
                            subcategory.SupplierName = header.Supplier;
                            subcategory.PercentDiscount = header.PercentDiscount;
                        }
                    })
                });

                return subcategories;
            });
        };

        //returns a JSON with all the information activities (week by week filter?)
        // | ProjectName | PartDescription | AreaRoom | StartDate | EndDate | SupplierName
        var _getActivities = function () {
            var regQuoteHeaders = $http.get(baseUrl + 'quoteheaders');
            var reqQuoteDetails = $http.get(baseUrl + 'quotedetails');
            var reqCategories = $http.get(baseUrl + 'categories');
            var reqProjects = $http.get(baseUrl + 'projects');
            var reqAreas = $http.get(baseUrl + 'areas');

            return $q.all([regQuoteHeaders, reqQuoteDetails, reqCategories, reqProjects, reqAreas]).then(function (values) {
                var quoteheaders = values[0].data;
                var quotedetails = values[1].data;
                var categories = values[2].data;
                var projects = values[3].data;
                var areas = values[4].data;

                quoteheaders.forEach(function (header) {
                    quotedetails.forEach(function (detail) {
                        if (detail.QuoteHeaderId == header.QuoteHeaderId) {
                            header.PartDescription = detail.PartDescription;
                            header.CategoryId = detail.CategoryId;
                            header.AreaId = detail.AreaId;
                        }
                    });
                    categories.forEach(function (category) {
                        if (category.CategoryId == header.CategoryId) {
                            header.ProjectId = category.ProjectId;
                        }
                    });
                    projects.forEach(function (project) {
                        if (project.ProjectId == header.ProjectId) {
                            header.ProjectName = project.ProjectName;
                        }
                    });
                    areas.forEach(function (area) {
                        if (area.AreaId == header.AreaId) {
                            header.AreaRoom = area.AreaRoom;
                        }
                    });
                })
                return quoteheaders;
            });
        };

        return {
            getProject: _getProject,
            addProject: _addProject,
            getAllProjects: _getAllProjects,

            getAllProjectsBudgetActual: _getAllProjectsBudgetActual,
            getCategoryDetailsAndSummary: _getCategoryDetailsAndSummary,
            getSubCategoryDetailsAndSummary: _getSubCategoryDetailsAndSummary,
            getActivities: _getActivities,
            getAllQuoteHeaders: _getAllQuoteHeaders
        };
    };
    var module = angular.module("diycm");
    module.factory("ReportsService", ['$http', '$q', ReportsService]);

    // Configure the $httpProvider by adding our date transformer
module.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.transformResponse.push(function(responseData){
        convertDateStringsToDates(responseData);
        return responseData;
    });
}]);

var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;
var dateString = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/;

function convertDateStringsToDates(input) {
    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        // TODO: Improve this regex to better match ISO 8601 date strings.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
            // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
            var milliseconds = Date.parse(match[0]);
            if (!isNaN(milliseconds)) {
                input[key] = new Date(milliseconds);
            }
        } else if (typeof value === "string" && (match = value.match(dateString))) {
            var date = Date.parse(match[0]);
            if (!isNaN(date)) {
                input[key] = new Date(date);
            }
        } else if (typeof value === "object") {
            // Recurse into object
            convertDateStringsToDates(value);
        }
    }
}


}());
