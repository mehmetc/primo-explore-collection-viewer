app.service('ngPrimo', ['$http', function($http) {
    var searchService = {};

            this.setup = function(ctrl) {
                angular.copy(ctrl.primolyticsService.searchService, searchService);
            }

            this.session = {
                view: {
                    code: window.appConfig['vid'],
                    institution: {
                        code: window.appConfig['primo-view']['attributes-map'].institutionCode,
                        name: window.appConfig['primo-view']['attributes-map'].institution
                    },
                    interfaceLanguage: window.appConfig['primo-view']['attributes-map'].interfaceLanguage
                }
            };

            this.search = {
                byQuery: function(query, options) {
                    var institution = options !== undefined && options['institution'] !== undefined ? options['institution'] : window.appConfig['primo-view'].institution['institution-code'];
                    var index = options !== undefined && options['index'] !== undefined ? options['index'] : 1;
                    var bulkSize = options !== undefined && options['bulkSize'] !== undefined ? options['bulkSize'] : 10;
                    var apiKey = options !== undefined && options['apiKey'] !== undefined ? options['apiKey'] : null;
                    var region = options !== undefined && options['region'] !== undefined ? options['region'] : 'na';
                    var restAPI = (options !== undefined) && (options['restAPI'] !== undefined) ? options['restAPI'] : false;

                    var regionURL = 'https://api-' + region + '.hosted.exlibrisgroup.com';

                    if (!Array.isArray(query)) {
                        query = [query];
                    }

                    //http://limo.libis.be/PrimoWebServices/xservice/search/brief?institution=KMKG&indx=1&bulkSize=500&query=lsr05,exact,MPLUS_32LIBIS_ALMA_DS71122741240001471&json=true
                    // this is a mock

                    return searchService.cheetah.performSearch({
                          fromIndex: index,
                          bulkSize: bulkSize,
                          query: 'lsr05,exact,MPLUS_32LIBIS_ALMA_DS71122741240001471', //query.join(';'),
                          scope: 'PHYS_ITEMS',
                          sortby: 'rank'
                        });
                    //
                    // return $http({
                    //     method: 'GET',
                    //     responseType: 'json',
                    //     url: '/data.json'
                    // });
                }
            };
}]);
