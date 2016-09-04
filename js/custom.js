(function(){
"use strict";
'use strict';

var app = angular.module('viewCustom', []);

app.component('prmFullViewAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'collectionController',
    templateUrl: 'custom/KMKG/html/collection.html'
});

window.searchService = {};
window.searchServiceCopy = {};

app.controller('collectionController', ['ngPrimo', function (ngPrimo) {
    var vm = this;
    var recordId = vm.parentCtrl.item.pnx.control.recordid;

    console.log(vm);

    ngPrimo.setup(vm.parentCtrl);

    ngPrimo.search.byQuery(['lsr05,exact,MPLUS_' + recordId], {
        bulkSize: 100
    }).then(function (response) {
        console.log(response);

        var result = response.data;
        var imageRecords = [];
        vm.imagesAll = [];
        vm.images = [];

        if (result) {
            imageRecords = result.docs;
            angular.forEach(imageRecords, function (data, i) {
                var title = '';
                if (typeof data.pnx.display.title === 'string') {
                    title = data.pnx.display.title;
                } else {
                    var language_ui = {
                        'en_US': 'eng',
                        'fr_FR': 'fre',
                        'nl_BE': 'dut'
                    };
                    var language_c = {
                        'en_US': 'en',
                        'fr_FR': 'fr',
                        'nl_BE': 'nl'
                    };
                    angular.forEach(data.pnx.display.title, function (rawTitle, i) {
                        if (rawTitle.split(/\$\$8/)[1] === language_ui[ngPrimo.session.view.interfaceLanguage]) {
                            title = rawTitle.replace(/\$\$8.*$/, '');
                        }
                    });

                    if (title === "") {
                        title = data.pnx.display.title[0].split(/\$\$8/)[0];
                    }
                }

                var linktorsrc = '';
                var backlink = '';
                var thumbnail = '';
                var language = ngPrimo.session.view.interfaceLanguage.split(/_/)[0];

                if (data.delivery.link) {
                    angular.forEach(data.delivery.link, function (links, i) {
                        switch (links.linkType) {
                            case 'http://purl.org/pnx/linkType/thumbnail':
                                thumbnail = links.linkURL;
                                break;
                            case 'http://purl.org/pnx/linkType/backlink':
                                backlink = links.linkURL;
                                break;
                            case 'http://purl.org/pnx/linkType/linktorsrc':
                                linktorsrc = links.linkURL;
                                break;
                        }
                    });
                }

                vm.imagesAll.push({
                    'title': title,
                    'linktorsrc': linktorsrc,
                    'backlink': backlink,
                    'thumbnail': thumbnail
                });
            });
            vm.images = vm.imagesAll.slice(0, 20);
        } else if (result && result.hasOwnProperty('MESSAGE')) {
            console.log(result[0].MESSAGE);
        }
    }, function (response) {
        console.log(response);
    });
    //    }
}]);

app.service('ngPrimo', ['$http', function ($http) {
    var searchService = {};

    this.setup = function (ctrl) {
        angular.copy(ctrl.primolyticsService.searchService, searchService);
    };

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
        byQuery: function byQuery(query, options) {
            var institution = options !== undefined && options['institution'] !== undefined ? options['institution'] : window.appConfig['primo-view'].institution['institution-code'];
            var index = options !== undefined && options['index'] !== undefined ? options['index'] : 1;
            var bulkSize = options !== undefined && options['bulkSize'] !== undefined ? options['bulkSize'] : 10;
            var apiKey = options !== undefined && options['apiKey'] !== undefined ? options['apiKey'] : null;
            var region = options !== undefined && options['region'] !== undefined ? options['region'] : 'na';
            var restAPI = options !== undefined && options['restAPI'] !== undefined ? options['restAPI'] : false;

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
})();