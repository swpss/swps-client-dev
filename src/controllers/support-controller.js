var app = angular.module('app');

app.controller('SupportCtrl', ['SupportService', '$scope', function(SupportService, $scope) {
    /*
     * List all complaints
     * List all issues
     * List corresponding reasons and solutions
     * Register new complaint
     * Get data for faults and service done till date
     * TODO: Error handling
    */

    $scope.userSolutions = {};
    $scope.showingSolutionForm = false;

    var complaintDetail = null;
    var faultCodes = [
        'Motor ON',
        'Dry Run',
        'Short Circuit',
        'Open Circuit',
        'Motor Jam',
        'Motor OFF',
        'Over Temp'
    ];

    $scope.isAllowedToRegister = function() {
        if(typeof $scope.solutions === 'undefined')
            return false;
        return Object.keys($scope.userSolutions) !== null || Object.keys($scope.userSolutions).length == $scope.solutions.length;
    };

    $scope.getIssues = function() {
        $scope.issues = null;
        SupportService.issue.query(function(data) {
            $scope.issues = data;
            $scope.err_msg = null;
        }, function(error) {
            $scope.err_msg = 'Something went wrong. Please try again.';
        });
    };

    $scope.getReasons = function(issue_id) {
        $scope.reasons = null;
        SupportService.reason.query({id: issue_id}, function(data) {
            $scope.reasons = data;
            $scope.err_msg = null;
        }, function(error) {
            $scope.err_msg = 'Something went wrong. Please try again.';
        });
    };

    $scope.getSolutions = function(issue, reason) {
        $scope.solutions = null;
        SupportService.solution.query({i: issue, r: reason}, function(data) {
            $scope.solutions = data;
            $scope.err_msg = null;
        }, function(error) {
            $scope.err_msg = 'Something went wrong. Please try again.';
        });
    };

    $scope.addNewComplaint = function(new_complaint) {
        var newComplaint = new SupportService.complaint(new_complaint);
        newComplaint.$save(function(newComplaint, responseHeaders) {
            $state.go('support.complaints');
            $scope.err_msg = null;
        }, function(error) {
            $scope.err_msg = 'Something went wrong. Please try again.';
        });
    };

    $scope.getComplaints = function() {
        $scope.complaints = null;
        SupportService.complaint.query(function(data) {
            $scope.complaints = data;
            $scope.err_msg = null;
        }, function(error) {
            $scope.err_msg = 'Something went wrong. Please try again.';
        });
    };

    $scope.issueResolved = function(complaint) {
        console.log($scope.showingSolutionForm);
        $scope.showingSolutionForm = true;
        complaintDetail = complaint;
        $scope.solution = {
            "isResolved": complaintDetail.isResolved,
            "description": null
        };
    };

    $scope.submitSolution = function(solution) {
        complaintDetail.isResolved = solution.isResolved;
        complaintDetail.solution = solution.description;
        complaintDetail.m_id = complaintDetail.machine.m_id;
        complaintDetail.issue_id = complaintDetail.issue.id;

        SupportService
            .complaint.update({id: complaintDetail.id}, complaintDetail, function(data) {
                $state.go('support.complaints');
                $scope.err_msg = null;
            }, function(error) {
                $scope.err_msg = 'Something went wrong. Please try again.';
            });
    };

    $scope.serviceData = false;

    $scope.getServiceDetails = function() {
        SupportService
            .service.get({id: $scope.m_id}, function(data) {
                var issues = data.issues;
                for(var idx = 0; idx < issues.length; ++idx) {
                    issues[idx].service_date = new Date(issues[idx].service_date);
                }
                data.issues = issues;
                $scope.serviceData = data;
                $scope.err_msg = null;
            }, function(error) {
                $scope.err_msg = 'Something went wrong. Please try again.';
            });
    };
}]);