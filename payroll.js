const payroll = (function () {
    var payrollStartDate = new Date('02/01/2019');
    var currentDate = new Date();
    let payrollDateRangeFilter = {from: payrollStartDate, to: currentDate};

    //------ Jordan edited the following 2 functions to make it work using HRID instead of MKTREPNAME
    function getPayrolls() {

        let userName = Knack.user.attributes.values.name;
        let knackId =  Knack.user.attributes.id;

        setTimeout(() => Knack.showSpinner(), 0)

        let api_url = 'https://api.knack.com/v1/objects/object_5/records';
        let filters = [
            {
                'field':'field_14', // Company connection field on Contact object
                operator: "is",
                value: Knack.user.attributes.values.email.email,
            }
        ];
        api_url += '?filters=' + encodeURIComponent(JSON.stringify(filters));
        setTimeout(() => Knack.showSpinner());
        $.ajax({
            url: api_url,
            dataType: 'json',
            type: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Knack.getUserToken(),
                "X-Knack-Application-Id": Knack.application_id,
                "X-Knack-REST-API-KEY": "71e543b0-a1af-11e9-b051-1fb54b980f24"
            },
            success: function (res) {
                console.log(res)
                getPayrollInfoFromZoho(res.records[0].field_102, userName)
            },
            error: function (request, error) {
                Knack.hideSpinner();
            }
        });
    }

    function getPayrollInfoFromZoho(hrid, userName){
        $.ajax({
            url: "https://ajt-sandbox.herokuapp.com/zoho",
            //url: "http://localhost:4000/api/v1/marketers",
            dataType: 'json',
            type: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                //full_name: 'Cormier, Yvon',
                full_name: `${userName.first}, ${userName.last}`,
                'hrid': hrid,
                date:  payrollDateRangeFilter,
                date_range: {from: formatDate(payrollStartDate), to: formatDate(currentDate)}
            }),
            success: function (res) {
                Knack.hideSpinner();
                addRowsToPayrolsTable(res);
            },
            error: function (request, error) {
                Knack.hideSpinner();
            }
        });
    }

    // add marketer data to Paroll tabel
    function addRowsToPayrolsTable(tableData) {
        let tbody = document.getElementById('view_562').querySelector('tbody');
        tbody.innerHtml = '';
        let headerColumns = [
            {key: 'Payroll period', title: 'Payroll period'},
            {key: 'Amount', title: 'Amount'},
            {key: 'MKTREPNAME', title: 'Marketer Name'},
            {key: 'ACTDATE', title: 'Date'},
            {key: 'Description', title: 'Description'}
        ];

        //remove the default no results row if response has length
        if (tableData.length) {
            $(tbody).empty();
        }

        tableData.forEach(data => {
            let tr = document.createElement('tr');
            headerColumns.forEach((column, index) => {
                let td = document.createElement('td');
                td.classList.add('cell-edit');

                let span = document.createElement('span');
                span.classList.add('col-' + index);
                span.innerText = data['' + column.key];

                td.appendChild(span);
                tr.appendChild(td);
            })
            tbody.appendChild(tr);
        })
    }

    //listen to filter input value changes
    function getInputFilterValue() {
        let view = document.querySelector('#view_562');

        let filterContainer = document.createElement('div');
        filterContainer.classList.add('filter-container');

        let fromInputField = document.createElement('input');
        fromInputField.setAttribute('placeholder', 'Select Start Date');
        fromInputField.setAttribute('type', 'date');
        fromInputField.setAttribute('name', 'from');

        let toInputField = document.createElement('input');
        toInputField.setAttribute('placeholder', 'Select End Date');
        toInputField.setAttribute('type', 'date');
        toInputField.setAttribute('name', 'to');

        filterContainer.appendChild(fromInputField);
        filterContainer.appendChild(toInputField);

        [fromInputField, toInputField].forEach(input => {
            input.oninput = function() {
                payrollDateRangeFilter[input.getAttribute('name')] = input.value ? formatDate(input.value) : '';
                getPayrolls();
            }
        })

        //view.prepend(filterContainer);
        view.insertBefore(filterContainer, view.children[1]);
    }


    return {
        getPayrolls,
        getInputFilterValue
    }
})();