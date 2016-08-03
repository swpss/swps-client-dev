var app = angular.module('app');

app.controller('ChartsCtrl', ['$scope', '$stateParams', '$interval', 'MachineService',
                                function($scope, $stateParams, $interval, MachineService){

     var _data_json;
     

     var errHandler = function(err) {
        $scope.err_msg = err.data.detail;
     };

     $scope.vfcpLineChart = function() {
            var chart_div = document.getElementById('vfcpLineChartDiv');
            var _data_table = new google.visualization.DataTable();
            var chart = new google.visualization.LineChart(chart_div);
            var options = {
                'title': '(Voltage | Frequency | Current | Power) v/s Time',
                
            };

            _data_table.addColumn('datetime', 'Time');
            _data_table.addColumn('number', 'Current');
            _data_table.addColumn('number', 'Voltage (x100 V)');
            _data_table.addColumn('number', 'Vmpp (x100 V)');
            _data_table.addColumn('number', 'Power');
            _data_table.addColumn('number', 'LPM (x100)');

            var m_id = $stateParams.mid;
            var vmpp = 0;
            var _rowsInserted = 0;

            MachineService
                .machineData.query({mid: m_id})
                    .$promise.then(function(response) {
                        _data_json = response.results.reverse();
                        // console.log(_data_json);

                        for(var idx = 0; idx < _data_json.length; ++idx) {
                            var time_stamp = new Date(_data_json[idx].timestamp);
                            var _today = new Date().toDateString();
                            if(time_stamp.toDateString() == _today) {
                                _data_table.addRow([
                                    time_stamp,
                                    _data_json[idx].data.current,
                                    _data_json[idx].data.voltage / 100.0,
                                    vmpp,
                                    _data_json[idx].data.power,
                                    _data_json[idx].data.lpm / 100.0]);
                                ++_rowsInserted;
                            }
                        }

                        MachineService
                            .machine.query({'id': _data_json[0].machine}, function(data) {
                                MachineService
                                    .machineDetail.get({'id': data.model.id}, function(detail_data) {
                                        vmpp = detail_data.rating_high_volts / 100.0;

                                        for(var idx = 0; idx < _rowsInserted; ++idx) {
                                            _data_table.setCell(idx, 3, vmpp);
                                        }
                                        chart.draw(_data_table, options);
                                    });
                            });

                    }, function(error) {
                        $scope.err_msg = 'Something went wrong. Please try again';
                    });

            var POLL_INTERVAL_M_SECS = 2000;

            // serverPoll calls the api every POLL_INTERVAL_M_SECS for new data,
            // by passing the timestamp of the most recent data.
            var serverPoll = $interval(
                function () {
                    // console.log('Polling!');
                    if(_data_json && _data_json.length) {
                        MachineService
                            .recentData.query(
                                {mid:m_id, t:_data_json[_data_json.length-1].timestamp},
                                function(data) {
                                    for(var idx = 0; idx < data.length; idx++) {
                                        // TODO: Push the new data into the array.
                                        // console.log('Before: ' + _data_json.length);
                                        _data_json.push(data[idx]);
                                        // console.log('After: ' + _data_json.length);

                                        var time_stamp = new Date(data[idx].timestamp);
                                        
                                        _data_table.addRow([
                                            time_stamp,
                                            data[idx].data.current,
                                            data[idx].data.voltage / 100.0,
                                            vmpp,
                                            data[idx].data.power,
                                            data[idx].data.lpm / 100.0
                                        ]);
                                    }

                                    if(data.length > 0) {
                                        chart.draw(_data_table, options);
                                    }
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

        $scope.lpdGraph = function() {
            var chart_div = document.getElementById('lpdBarChartDiv');
            var bar_chart = new google.visualization.ColumnChart(chart_div);
            var data_table = new google.visualization.DataTable();
            var options = {
                'title': 'LPD v/s Time'
            };

            data_table.addColumn('string', 'Date');
            data_table.addColumn('number', 'LPD');
            
            var lpd_data = MachineService
                                .lpdData.query({'mid': $stateParams.mid, 'period': 'month'},
                                function(data) {
                                    // console.log(data);
                                    for(var idx = 0; idx < data.length; ++idx) {
                                        var date = data[idx].date.split('-').reverse().join('-');
                                        data_table.addRow([
                                            date,
                                            data[idx].lpd
                                        ]);
                                    }
                                    bar_chart.draw(data_table, options);
                                }, function (err) {
                                    $scope.err_msg = 'Something went wrong. Please try again.';
                                });

        };

        $scope.mulLpd  = function() {
            var chart_div = document.getElementById('mulLpdDiv');
            var chart = new google.visualization.LineChart(chart_div);
            var data_table = new google.visualization.DataTable();
            var options = {
                'title': 'Multiple LPD v/s Time'
            };

            data_table.addColumn('string', 'Date');
            data_table.addColumn('number', 'Average');
            
            var multipleData = MachineService
                                .multipleData.query({'period': 'month'},
                                function(data) {
                                    // console.log(data);
                                    for(var idx = 0; idx < data.length; ++idx) {
                                        var date = data[idx].date.split('-').reverse().join('-');
                                        data_table.addRow([
                                            date,
                                            data[idx].avg
                                        ]);
                                    }
                                    chart.draw(data_table, options);
                                }, function (err) {
                                    $scope.err_msg = 'Something went wrong. Please try again.';
                                });

        };

      $scope.mulLpd1  = function() {
            var chart_div = document.getElementById('mulLpd1Div');
            var chart = new google.visualization.ColumnChart(chart_div);
            var data_table = new google.visualization.DataTable();
            var multipleData = MachineService
                                .multipleData1.query({'period': 'month'},
                                function(data) {
                                    table_array = data
                                    b = Object.keys(table_array[0])
                                    position_date = b.indexOf("date")
                                    position_avg = b.indexOf("avg")
                                    c = b[0]
                                    b[0] = b[position_date]
                                    b[position_date] = c
                                    some_array = [b]
                                    c = b[1]
                                    b[1] = b[position_avg]
                                    b[position_avg] = c
                                    some_array = [b]
                                    for (i=0; i<table_array.length; i++)
                                     {
                                         var some_child_array=[]
                                         table_keys = Object.keys(table_array[i])
                                         for (j=0; j<table_keys.length; j++)
                                         {
                                            some_child_array.push(table_array[i][table_keys[j]])
                                            console.log(typeof(table_array[i][table_keys[j]]))
                                         }
                                         c = some_child_array[0]
                                         some_child_array[0] = some_child_array[position_date]
                                         some_child_array[position_date] = c
                                         c = some_child_array[1]
                                         some_child_array[1] = some_child_array[position_avg]
                                         some_child_array[position_avg] = c                 
                                         some_array.push(some_child_array)
                                     }
                                    console.log(some_array)                                 
                                    var data = new google.visualization.arrayToDataTable(some_array);
                                    var options = {
                                          seriesType: 'bars',
                                          series: {0: {type: 'line'}}
                                        };
                                    chart.draw(data, options);    

                                }, function (err) {
                                    $scope.err_msg = 'Something went wrong. Please try again.';
                                });

        };


        //  $scope.mulLpd1  = function() {
        //     var chart_div = document.getElementById('mulLpd1Div');
        //     var chart = new google.visualization.ColumnChart(chart_div);
        //     var data_table = new google.visualization.DataTable();
        //     var multipleData = MachineService
        //                         .multipleData1.query({'period': 'month'},
        //                         function(data) {
        //                             table_array = data
        //                             b = Object.keys(table_array[0])
        //                             c = b[1]
        //                             b[1] = b[b.length-1]
        //                             b[b.length-1] = c
        //                             some_array = [b]
        //                             for (i=0; i<table_array.length; i++)
        //                              {
        //                                  var some_child_array=[]
        //                                  table_keys = Object.keys(table_array[i])
        //                                  for (j=0; j<table_keys.length; j++)
        //                                  {
        //                                     some_child_array.push(table_array[i][table_keys[j]])
        //                                  }
        //                                  c = some_child_array[1]
        //                                  some_child_array[1] = some_child_array[some_child_array.length-1]
        //                                  some_child_array[some_child_array.length-1] = c                 
        //                                  some_array.push(some_child_array)
        //                              }                               
        //                             var data = new google.visualization.arrayToDataTable(some_array);
        //                             var options = {
        //                                   seriesType: 'bars',
        //                                   series: {1: {type: 'line'}}
        //                                 };
        //                             chart.draw(data, options);    

        //                         }, function (err) {
        //                             $scope.err_msg = 'Something went wrong. Please try again.';
        //                         });

        // };


        $scope.powGraph = function () {
            var chart_div = document.getElementById('powColChartDiv');
            var col_chart = new google.visualization.ColumnChart(chart_div);
            var data_table = new google.visualization.DataTable();

            var options = {
                'title': 'Power generation(KwH v/s Time)'
            };

            data_table.addColumn('string', 'Date');
            data_table.addColumn('number', 'KwH');

            var pow_data = MachineService
                                .powData.query({'mid': $stateParams.mid, 'period': 'month'},
                                    function(data) {
                                        //console.log(data);
                                        for(var idx = 0; idx < data.length; ++idx) {
                                            var date = data[idx].date.split('-').reverse().join('-');
                                            data_table.addRow([
                                                date,
                                                data[idx].pow_h
                                        ]);
                                        }
                                        col_chart.draw(data_table, options);
                                    }, function(err) {
                                        $scope.err_msg = 'Something went wrong. Please try again.';
                                    });
        };
    
}]);