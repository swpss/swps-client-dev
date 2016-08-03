var app = angular.module('app');

app.controller('DashboardCtrl', [
    '$scope', 'MachineService', '$stateParams', '$http',
    function($scope, MachineService, $stateParams, $http) {
    $scope.period = 'day';
    $scope.periodOptions = {
        'day': 'Past 24 hours',
        'week': 'Week',
        'month': 'Month'
    };
    $scope.totalLPD = 0;
    $scope.totalDurationInHrs = 0;
    $scope.totalEnergyUsed = 0;
    $scope.hrs ;
    $scope.dur=0;
    $scope.state;
    // Dashboard controller
    // Provides summary of data for the current day / week / month.
    // Total hours run, avg power, energy used, total litres pumped
    // Avg current, avg voltage

    // Get full data of that particular day / week / month
    // Compute avg power, avg current, avg voltage from this data
    // Get LPD data and Pow data from GETLPDData and GETPowData views
    // Total duration:
    // GetLpdData --> minutes
    // GetPowData --> hours

    $scope.getSummaryData = function(period) {
        $scope.period = period;
        var totalLPD = 0;
        var totalEnergyUsed = 0;
        var totalDurationInHrs = 0;
        var hrs;

        var currentDate = new Date();
        var endDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
        var startDate = new Date();

        if(period == 'day') {
            startDate.setDate(currentDate.getDate() - 1);
        }
        else if(period == 'week') {
            startDate.setDate(currentDate.getDate() - 7);
        }
        else {
            startDate.setDate(currentDate.getDate() - 30);
        }

        startDate = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();

        MachineService
            .lpdData.query({'mid': $stateParams.mid, 'period': $scope.period},
            function(data) {
                for(var idx = 0; idx < data.length; ++idx) {
                    totalLPD += data[idx].lpd;
                    totalDurationInHrs += (data[idx].t_duration);
                }
                b = totalDurationInHrs;
                $scope.dur=totalDurationInHrs;
                var secs = b % 60;
                b = (b - secs) / 60;
                var mins = b % 60;
                var hrs = (b - mins) / 60;
                $scope.totalDurationInHrs = hrs +" Hrs : "+mins+" Mins : "+secs+" Secs"
                $scope.totalLPD = totalLPD;
        $scope.fault_period = {
            1:"Hour",
            2: "day"
        }
        $scope.faults = {
                    1.0:{
                    "fault":"Dry Run",
                    "reason":"No Water" 
                },
                6.0:{
                    "fault":"Over Temprature",
                    "reason":"Direct Sun On Controller"
                },
                2.0:{
                    "fault":"Short Circuit",
                    "reason":"Motor Problem or Controller Problem"
                },
                3.0:{
                    "fault":"Open Circuit",
                    "reason":"Connect Motor or Motor Is Not Connected"
                },
                4.0:
                {
                    "fault":"Motor Jam/ Overload",
                    "reason":"Motor clean or Motor Replace or Motor Repair"
                },
                7.0:
                {
                    "fault":"No Sun",
                    "reason":"No Sun"
                }
            }
             $http({
                method: "GET",
                url: "http://localhost:9000/api/v1/status/",
                params: {
                    mid : $stateParams.mid
                }
                })
                 .success(function (data, status, headers, config) { 
                    $scope.status_data = data
                    var range_fre = [1,2,3,4,5]
                    for (i=0; i<range_fre.length; i++)
                    {
                    if ((data.due_to == 0) && (data.frequency==range_fre[i]))
                    {
                        $scope.status_data.due_to=7
                    }
                    } 
                })
                 .error( function(status){
                    alert(status)
                 });
                
             $http({
                method: "GET",
                url: "http://localhost:9000/api/v1/due_to/",
                params: {
                    mid : $stateParams.mid
                }
                })
                 .success(function (data, status, headers, config) { 
                    if ((data[0][0] == undefined)|| (data[0][0][2]==0)) 
                        {
                            $scope.fault_data = 0
                        }
                    else{

                        $scope.fault_data = data
                        } 
                    })
                .error(function (data, status, headers, config) { 
                    alert("No data available")
                    });
            }, function (err) {
                $scope.err_msg = 'Something went wrong. Please try again.';
            });
           


        

        MachineService
            .rangeData.query({'mid': $stateParams.mid, s:startDate, e: endDate},
            function(data) {
                var voltageArr = [],
                    currentArr = [],
                    powerArr = [],
                    frequencyArr = [];

                for(var idx = 0; idx < data.length; ++idx) {
                    voltageArr.push(data[idx].data.voltage);
                    currentArr.push(data[idx].data.current);
                    powerArr.push(data[idx].data.power);
                    frequencyArr.push(data[idx].data.frequency);
                }

                var sumFunction = function(prev, curr) {
                    return prev + curr;
                };
                if(data.length !== 0) {
                    $scope.avgVoltage = voltageArr.reduce(sumFunction) / voltageArr.length;
                    $scope.avgCurrent = currentArr.reduce(sumFunction) / currentArr.length;
                    $scope.avgPower = powerArr.reduce(sumFunction) / powerArr.length;
                    $scope.avgFrequency = frequencyArr.reduce(sumFunction) / frequencyArr.length; 
                    $scope.totalEnergyUsed= $scope.avgPower * ($scope.dur/3600);
                } else {
                    $scope.avgFrequency = 0;
                    $scope.avgPower = 0;
                    $scope.avgCurrent = 0;
                    $scope.avgVoltage = 0;
                    $scope.totalEnergyUsed = 0;
                }
            }, function(err) {
                $scope.err_msg = 'Something went wrong. Please try again.';
        });
    };
}]);