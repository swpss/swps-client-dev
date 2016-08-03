var app = angular.module('app');

app.controller('MachineCtrl',
    ['$scope', '$state', '$stateParams', '$interval',
        'MachineService', 'HelperService', 'LocalMachineDataService', '$filter',
    function ($scope, $state, $stateParams, $interval, MachineService, HelperService, LocalMachineDataService, $filter) {
        $scope.new_machine = {};
        $scope.states = HelperService.states;

        var faultCodes = [
            'Motor ON',
            'Dry Run',
            'Short Circuit',
            'Open Circuit',
            'Motor Jam',
            'Motor OFF',
            'Over Temp'
        ];

        var statusCodes = [
            'ON',
            'OFF'
        ];

        $scope.addNewMachine = function(new_machine) {
            new_machine = new MachineService.machine(new_machine);
            var create_response = new_machine.$save(
                function(machine, responseHeaders) {
                    $state.go('home');
                    $scope.err_msg = null;
                },
                function(err) {
                    $scope.err_msg = err.data.detail;
                }
            );
        };

        $scope.editMachineInformation = {
            init: function() {
                $scope.machine = LocalMachineDataService.get();
                $scope.machine.farmer_phone_number = $scope.machine.bought_by.phone_number;
            },
            update: function() {
                if(typeof $scope.machine.bought_by !== 'number') {
                    $scope.machine.farmer_email = $scope.machine.bought_by.email;
                    $scope.machine.machine_model = $scope.machine.model.id;
                    $scope.machine.bought_by = $scope.machine.bought_by.id;
                    $scope.machine.sold_by = $scope.machine.sold_by.id;
                }

                MachineService
                    .machine.update({id: $scope.machine.id}, $scope.machine,
                        function(response){
                            $scope.err_msg = null;
                            alert('Details of ' + $scope.machine.m_id + ' have been successfully updated.');
                    }, function(error) {
                        $scope.err_msg = 'Something went wrong. Please try again later.';
                    });
            }
        };

        $scope.resetForm = function() {
            $scope.new_machine = {};
        };

        $scope.getMachines = function (pageNumber) {
            pageNumber = typeof pageNumber !== 'undefined' ? pageNumber : 1;

            $scope.showingMachine = false;
            MachineService.machine.query({page: pageNumber})
                .$promise.then(function(response) {
                    $scope.machines = angular.copy(response.results);
                    $scope.nextPage = HelperService.getPageNumber(response.next);
                    $scope.previousPage = HelperService.getPageNumber(response.previous);
                    $scope.err_msg = null;
                },
                function(err) {
                    $scope.err_msg = 'You must be logged in to perform this action';
                }
            );
        };

        // GETS all the available machine models,
        // Used while adding new machines `add-machine.html`
        $scope.getMachineModels = function() {
            MachineService.machineDetail.query(function(models) {
                $scope.models = models;
            });
        };

        $scope.saveMachineData = function(data) {
            LocalMachineDataService.set(data);
        };

        /*
            * The functions below are used to get data of a particular machine.
            * initMonitoring() -> used to populate the fields in the view with machine's data.
            * getData() -> returns data of a machine upto the time at which the api call is made.
        */

        $scope.getData = function(pageNumber) {
            pageNumber = typeof pageNumber !== 'undefined' ? pageNumber : 1;

            $scope.stop = false;
            $scope.m_id = $stateParams.mid;

            MachineService
                .machineData.query({mid: $scope.m_id, page: pageNumber})
                    .$promise.then(function(response) {
                        $scope.previousPage = HelperService.getPageNumber(response.previous);
                        $scope.nextPage = HelperService.getPageNumber(response.next);
                        $scope.currentPage = $scope.nextPage !== null ? $scope.nextPage - 1 : $scope.previousPage + 1;
                        $scope.datasets = [];
                        $scope.showData = false;
                        var _response = response.results.reverse();

                        if(pageNumber == 1)
                            $scope.lastUpdated = _response[_response.length-1].timestamp;

                        var _lastUpdated = new Date($scope.lastUpdated).toDateString();
                        var _today = new Date().toDateString();

                        for(var idx = 0; idx < _response.length; ++idx) {
                            var datasetDate = new Date(_response[idx].timestamp);
                            if(datasetDate.toDateString() == _today) {
                                $scope.showData = true;
                                $scope.datasets.push(_response[idx]);
                            }
                        }

                        for(var idx = 0; idx < $scope.datasets.length; ++idx) {
                            $scope.datasets[idx].data.due_to = faultCodes[$scope.datasets[idx].data.due_to];
                            $scope.datasets[idx].data.status = statusCodes[$scope.datasets[idx].data.status];
                        }

                        // console.log($scope.datasets);

                        if($scope.currentPage === 1) {
                            $scope.initMonitoring();
                        } else {
                            $scope.stopPolling();
                        }
                        $scope.err_msg = null;
                    }, function(error) {
                        $scope.err_msg = 'Something went wrong. Please try again';
                    });
        };

        $scope.initMonitoring = function () {
            var POLL_INTERVAL_M_SECS = 2000;

            // serverPoll calls the api every POLL_INTERVAL_M_SECS for new data,
            // by passing the timestamp of the most recent data.
            var serverPoll = $interval(
                function () {
                    if($scope.datasets && $scope.datasets.length) {
                        var data = MachineService
                            .recentData.query(
                                {mid:$scope.m_id, t:$scope.datasets[$scope.datasets.length-1].timestamp},
                                function() {
                                    for(var idx = 0; idx < data.length; idx++) {
                                        data[idx].data.due_to = faultCodes[data[idx].data.due_to];
                                        data[idx].data.status = statusCodes[data[idx].data.status];
                                        $scope.datasets.push(data[idx]);
                                    }
                                    if(data.length > 0)
                                        $scope.lastUpdated = data[data.length-1].timestamp;
                                    $scope.err_msg = null;
                                }, function (err) {
                                    $scope.err_msg = 'Couldn\'t update data. Try reloading the page.';
                                }
                            );
                    }
                }, POLL_INTERVAL_M_SECS);

            $scope.stopPolling = function() {
                $scope.stop = true;
                if($scope.stop) {
                    $interval.cancel(serverPoll);
                    serverPoll = undefined;
                }
            };

            // Stops the server from polling the api after
            // this instance of controller goes out of scope.
            $scope.$on('$destroy', $scope.stopPolling);
        };

       $scope.getPreviousData = function() {
            $scope.past.showForm = false;
            $scope.isLoading = true;
            $scope.currentPage = 0;
            $scope.pageSize = 20;
            var changeDateFormat = function(currDate) {
                var day = currDate.getDate();
                var month = currDate.getMonth() + 1;
                var year = currDate.getFullYear();

                return year + '-' + month + '-' + day;
            };

            $scope.m_id = $stateParams.mid;
            var startDate = changeDateFormat($scope.datePicker.startDate.date);
            var endDate = changeDateFormat($scope.datePicker.endDate.date);

            MachineService
                .rangeData.query({
                    mid: $scope.m_id,
                    s: startDate,
                    e: endDate
                }, function(data) {
                        for(var idx = 0; idx < data.length; ++idx) {
                            data[idx].data.due_to = faultCodes[data[idx].data.due_to];
                            data[idx].data.status = statusCodes[data[idx].data.status];
                        }
                        $scope.numberOfPages=function(){
                           return Math.ceil(data.length/$scope.pageSize);                
                        }
                        $scope.datasets = data;
                        $scope.isLoading = false;
                        $scope.err_msg = null;
                }, function(error) {
                    return null;
                });
        };

        $scope.downloadData = function() {
            var datasets = $scope.datasets.reverse();
            var file_name = $scope.m_id+ '.csv';
            var dataUrl = 'data:text/csv;charset=utf-8,';
            var json = [];
            if(datasets !== null) {
                for(idx = 0; idx < datasets.length; idx++) {
                    var dataset = datasets[idx].data;
                    var time = datasets[idx].timestamp;
                    time = $filter('date')(time, "dd/MMMM/yyyy-hh:mm a");
                    dataset.time = time;
                    json.push(dataset);
            }
                var fields = Object.keys(json[0]);
                var csv = json.map(
                            function(row) {
                                return fields.map(
                                    function(fieldName) {
                                        return '"' + (row[fieldName] || '') + '"';
                                    }
                                );
                            }
                        );
                
                csv.unshift(fields);
                
                var csv_str = csv.join('%0A');
                var downloadURL = dataUrl + csv_str;
                
                var saveAs = function(uri, filename) {
                    var link = document.createElement('a');
                    if (typeof link.download === 'string') {
                        document.body.appendChild(link); // Firefox requires the link to be in the body
                        link.download = filename;
                        link.href = uri;
                        link.target = "_blank";
                        link.click();
                        document.body.removeChild(link); // remove the link when done
                    } else {
                        location.replace(uri);
                    }
                };
                saveAs(downloadURL, file_name);
            } else {
               $scope.err_msg = 'Failed to get data. Try reloading the page.';
            }
        };

        $scope.printData = function() {
            var printContents = document.getElementById('pastDataTable').innerHTML;
            var popupWin = window.open('', '_blank');
            popupWin.document.open();
            popupWin.document.write('<html><head><style>table { border-collapse: collapse; } table, th, td { border: 1px solid black; }</style></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
        };

        // Datepicker helpers
        $scope.past = {
            showForm: true
        };

        $scope.toggleForm = function() {
            $scope.past.showForm = !$scope.past.showForm;
        };

        $scope.datePicker = {
            format: 'yyyy-MM-dd',
            today: new Date(),
            startDate: {
                opened: false,
                date: new Date(),
                toggle: function() {
                    this.opened = !this.opened;
                }
            },
            endDate: {
                opened: false,
                date: new Date(),
                toggle: function() {
                    this.opened = !this.opened;
                }
            }
        };
    }
]);