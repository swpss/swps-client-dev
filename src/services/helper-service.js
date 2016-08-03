var app = angular.module('app');

app.factory('HelperService', [function () {
    states = [
    {code:"IN-AP", name: "Andhra Pradesh"},
    {code:"IN-AR", name: "Arunachal Pradesh"},
    {code:"IN-AS", name: "Assam"},
    {code:"IN-BR", name: "Bihar"},
    {code:"IN-CT", name: "Chhattisgarh"},
    {code:"IN-GA", name: "Goa"},
    {code:"IN-GJ", name: "Gujarat"},
    {code:"IN-HR", name: "Haryana"},
    {code:"IN-HP", name: "Himachal Pradesh"},
    {code:"IN-JK", name: "Jammu and Kashmir"},
    {code:"IN-JH", name: "Jharkhand"},
    {code:"IN-KA", name: "Karnataka"},
    {code:"IN-KL", name: "Kerala"},
    {code:"IN-MP", name: "Madhya Pradesh"},
    {code:"IN-MH", name: "Maharashtra"},
    {code:"IN-MN", name: "Manipur"},
    {code:"IN-ML", name: "Meghalaya"},
    {code:"IN-MZ", name: "Mizoram"},
    {code:"IN-NL", name: "Nagaland"},
    {code:"IN-OR", name: "Odisha"},
    {code:"IN-PB", name: "Punjab"},
    {code:"IN-RJ", name: "Rajasthan"},
    {code:"IN-SK", name: "Sikkim"},
    {code:"IN-TN", name: "Tamil Nadu"},
    {code:"IN-TG", name: "Telangana"},
    {code:"IN-TR", name: "Tripura"},
    {code:"IN-UT", name: "Uttarakhand"},
    {code:"IN-UP", name: "Uttar Pradesh"},
    {code:"IN-WB", name: "West Bengal"},
    {code:"IN-AN", name: "Andaman and Nicobar Island"},
    {code:"IN-CH", name: "Chandigarh"},
    {code:"IN-DN", name: "Dadra and Nagar Haveli"},
    {code:"IN-DD", name: "Daman and Diu"},
    {code:"IN-DL", name: "Delhi"},
    {code:"IN-LD", name: "Lakshadweep"},
    {code:"IN-PY", name: "Puducherry"}
    ];

    user_types = {
        0: 'Integrator',
        1: 'Electricity Officer',
        2: 'Nodal Officer',
        3: 'Farmer',
        4: 'Manufacturer',
        5: 'Technician(cybermotion)',
        6: 'Technician(client)',
        7: 'Technician(location)'
    };

    user_types_rev = {
        'Integrator': 0,
        'Electricity Officer': 1,
        'Nodal Officer': 2,
        'Farmer': 3,
        'Manufacturer': 4,
        'Technician': 5
    };

    var _getPageNumber = function(url) {
        var _pageLiteral = 'page=';

        if(url === null)
            return null;
        
        var idx = url.search(_pageLiteral);
        if(idx === -1)
            return 1;

        return url.slice(idx + _pageLiteral.length, url.length);
    };

    return {
        states: states,
        user_types: user_types,
        user_types_rev: user_types_rev,
        getPageNumber: _getPageNumber
    };
}])
