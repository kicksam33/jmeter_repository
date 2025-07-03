/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9117647058823529, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, ""], "isController": true}, {"data": [1.0, 500, 1500, "-21-1"], "isController": false}, {"data": [1.0, 500, 1500, "-10"], "isController": false}, {"data": [1.0, 500, 1500, "-11"], "isController": false}, {"data": [1.0, 500, 1500, "-12"], "isController": false}, {"data": [0.0, 500, 1500, "-13"], "isController": false}, {"data": [1.0, 500, 1500, "-14"], "isController": false}, {"data": [1.0, 500, 1500, "-15"], "isController": false}, {"data": [1.0, 500, 1500, "-16"], "isController": false}, {"data": [1.0, 500, 1500, "-17"], "isController": false}, {"data": [1.0, 500, 1500, "-18"], "isController": false}, {"data": [1.0, 500, 1500, "-19"], "isController": false}, {"data": [1.0, 500, 1500, "-21-0"], "isController": false}, {"data": [1.0, 500, 1500, "-13-1"], "isController": false}, {"data": [0.0, 500, 1500, "-13-0"], "isController": false}, {"data": [1.0, 500, 1500, "-1"], "isController": false}, {"data": [1.0, 500, 1500, "-2"], "isController": false}, {"data": [1.0, 500, 1500, "-3"], "isController": false}, {"data": [1.0, 500, 1500, "-17-1"], "isController": false}, {"data": [1.0, 500, 1500, "-4"], "isController": false}, {"data": [1.0, 500, 1500, "-17-0"], "isController": false}, {"data": [1.0, 500, 1500, "-5"], "isController": false}, {"data": [1.0, 500, 1500, "-6"], "isController": false}, {"data": [1.0, 500, 1500, "-7"], "isController": false}, {"data": [1.0, 500, 1500, "-8"], "isController": false}, {"data": [1.0, 500, 1500, "-20"], "isController": false}, {"data": [1.0, 500, 1500, "-9"], "isController": false}, {"data": [1.0, 500, 1500, "-21"], "isController": false}, {"data": [1.0, 500, 1500, "-22"], "isController": false}, {"data": [1.0, 500, 1500, "-23"], "isController": false}, {"data": [1.0, 500, 1500, "-24"], "isController": false}, {"data": [1.0, 500, 1500, "-25"], "isController": false}, {"data": [1.0, 500, 1500, "-26"], "isController": false}, {"data": [1.0, 500, 1500, "-27"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 33, 0, 0.0, 1949.0606060606065, 4, 32039, 6.0, 11.0, 16.799999999999997, 32011.0, 1.0211659858893427, 1.0163611388321574, 1.7762220146367123], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "75th pct", "85th pct", "95th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["", 1, 0, 0.0, 32264.0, 32264, 32264, 32264.0, 32264.0, 32264.0, 32264.0, 0.030994297049342923, 0.7215254424435903, 1.6337687224925612], "isController": true}, {"data": ["-21-1", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 516.40625, 139.2578125], "isController": false}, {"data": ["-10", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 87.646484375, 575.927734375], "isController": false}, {"data": ["-11", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 87.646484375, 575.927734375], "isController": false}, {"data": ["-12", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 87.646484375, 575.68359375], "isController": false}, {"data": ["-13", 1, 0, 0.0, 32039.0, 32039, 32039, 32039.0, 32039.0, 32039.0, 32039.0, 0.031211960423234184, 0.10274952986984612, 0.05428564600955086], "isController": false}, {"data": ["-14", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 35.05859375, 157.6171875], "isController": false}, {"data": ["-15", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 58.43098958333333, 438.4765625], "isController": false}, {"data": ["-16", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 70.1171875, 473.4375], "isController": false}, {"data": ["-17", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 261.3932291666667, 129.150390625], "isController": false}, {"data": ["-18", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 50.083705357142854, 279.0178571428571], "isController": false}, {"data": ["-19", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 20.62270220588235, 159.58180147058823], "isController": false}, {"data": ["-21-0", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 110.9375, 140.625], "isController": false}, {"data": ["-13-1", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 35.0, 28.57142857142857, 74.88839285714285, 22.879464285714285], "isController": false}, {"data": ["-13-0", 1, 0, 0.0, 31999.0, 31999, 31999, 31999.0, 31999.0, 31999.0, 31999.0, 0.03125097659301853, 0.020966231366605206, 0.029328309087783996], "isController": false}, {"data": ["-1", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 67.05729166666667, 9.861366421568627], "isController": false}, {"data": ["-2", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 31.871448863636367, 143.6434659090909], "isController": false}, {"data": ["-3", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 43.8232421875, 311.8896484375], "isController": false}, {"data": ["-17-1", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 645.5078125, 193.603515625], "isController": false}, {"data": ["-4", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 50.083705357142854, 196.98660714285714], "isController": false}, {"data": ["-17-0", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 79.24107142857143, 110.77008928571428], "isController": false}, {"data": ["-5", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 50.083705357142854, 218.05245535714286], "isController": false}, {"data": ["-6", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 23.372395833333336, 153.38541666666669], "isController": false}, {"data": ["-7", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 87.646484375, 575.927734375], "isController": false}, {"data": ["-8", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 87.646484375, 575.927734375], "isController": false}, {"data": ["-20", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 70.1171875, 424.4140625], "isController": false}, {"data": ["-9", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 87.646484375, 575.927734375], "isController": false}, {"data": ["-21", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 285.15625, 127.21946022727273], "isController": false}, {"data": ["-22", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 58.43098958333333, 277.34375], "isController": false}, {"data": ["-23", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 70.1171875, 498.046875], "isController": false}, {"data": ["-24", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 70.1171875, 430.859375], "isController": false}, {"data": ["-25", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 516.2109375, 140.234375], "isController": false}, {"data": ["-26", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 87.646484375, 408.935546875], "isController": false}, {"data": ["-27", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 87.646484375, 602.5390625], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 33, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
