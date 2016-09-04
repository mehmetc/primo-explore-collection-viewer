window.searchService = {};
window.searchServiceCopy = {};

app.controller('collectionController', ['ngPrimo', function(ngPrimo) {
    var vm = this;
    var recordId = vm.parentCtrl.item.pnx.control.recordid;

    console.log(vm);

    ngPrimo.setup(vm.parentCtrl);

    ngPrimo.search.byQuery([`lsr05,exact,MPLUS_${recordId}`], {
        bulkSize: 100
    }).then(function(response) {
        console.log(response);

        var result = response.data;
        var imageRecords = [];
        vm.imagesAll = [];
        vm.images = [];

        if (result) {
            imageRecords = result.docs;
            angular.forEach(imageRecords, function(data, i) {
                var title = '';
                if (typeof(data.pnx.display.title) === 'string') {
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
                    angular.forEach(data.pnx.display.title, function(rawTitle, i) {
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
                    angular.forEach(data.delivery.link, function(links, i) {
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
            })
            vm.images = vm.imagesAll.slice(0, 20);
        } else if (result && result.hasOwnProperty('MESSAGE')) {
            console.log(result[0].MESSAGE);
        }
    }, function(response) {
        console.log(response);
    });
    //    }

}]);
