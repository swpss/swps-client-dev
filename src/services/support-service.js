var app = angular.module('app');

app.factory('SupportService', ['baseUrl', '$resource', function(baseUrl, $resource) {
    var supportUrl = baseUrl + 'support/';
    var complaintResource = $resource(supportUrl + 'complaints/:id/', null, {
        'update': {
            method: 'PUT'
        },
        'query': {
            method: 'GET',
            isArray: true
        }
    });
    var issueResource = $resource(supportUrl + 'issues/', null, {
        'query': {
            method: 'GET',
            isArray: true
        }
    });
    var reasonResource = $resource(supportUrl + 'issues/:id/reasons/', null, {
        'query': {
            method: 'GET',
            isArray: true
        }
    });
    var solutionResource = $resource(supportUrl + 'solutions/', null, {
        'query': {
            method: 'GET',
            isArray: true,
            params: {
                i: '@issue',
                r: '@reason'
            }
        }
    });
    var serviceResource = $resource(supportUrl + 'service/:id/');


    return {
        complaint: complaintResource,
        issue: issueResource,
        reason: reasonResource,
        solution: solutionResource,
        service: serviceResource
    };
}]);

app.factory('ComplaintForm', [function() {
    var complaint = {
        m_id: null,
        description: null,
        issue_id: null,
    };

    var setComplaint = function(m_id, description, issue_id) {
        complaint.m_id = m_id;
        complaint.description = description;
        complaint.issue_id = issue_id;
    };

    var getComplaint = function() {
        return complaint;
    };

    return {
        set: setComplaint,
        get: getComplaint
    };
}]);