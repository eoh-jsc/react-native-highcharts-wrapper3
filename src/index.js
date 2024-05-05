import React, { useState } from 'react';
import WebView from 'react-native-webview';

const Highcharts = (props) => {
  const [init] = useState(`<html>
                    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />
                    <style media="screen" type="text/css">
                    #container {
                        width:100%;
                        height:100%;
                        top:0;
                        left:0;
                        right:0;
                        bottom:0;
                        position:absolute;
                        user-select: none;
                        -webkit-user-select: none;
                    }
                    </style>
                    <head>
                        <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
                        ${
                          props.stock
                            ? '<script src="https://code.highcharts.com/stock/highstock.js"></script>'
                            : '<script src="https://code.highcharts.com/highcharts.js"></script>'
                        }
                        ${
                          props.more
                            ? '<script src="https://code.highcharts.com/highcharts-more.js"></script>'
                            : ''
                        }
                        ${
                          props.guage
                            ? '<script src="https://code.highcharts.com/modules/solid-gauge.js"></script>'
                            : ''
                        }
                        <script src="https://code.highcharts.com/modules/exporting.js"></script>
                        <script>
                        $(function () {
                            Highcharts.setOptions(${JSON.stringify(
                              props.options
                            )});
                            Highcharts.${
                              props.stock ? 'stockChart' : 'chart'
                            }('container', `);
  const [end] = useState(`           );
                        });
                        </script>
                    </head>
                    <body>
                        <div id="container">
                        </div>
                    </body>
                </html>`);

  const flattenText = (item, key) => {
    let str = '';
    if (item && typeof item === 'object' && item.length === undefined) {
      str += flattenObject(item);
    } else if (item && typeof item === 'object' && item.length !== undefined) {
      str += '[';
      item.forEach((k2) => {
        str += `${flattenText(k2)}, `;
      });
      if (item.length > 0) {
        str = str.slice(0, str.length - 2);
      }
      str += ']';
    } else if (typeof item === 'string' && item.slice(0, 8) === 'function') {
      str += `${item}`;
    } else if (typeof item === 'string') {
      // eslint-disable-next-line no-useless-escape
      str += `\"${item.replace(/"/g, '\\"')}\"`;
    } else {
      str += `${item}`;
    }
    return str;
  };

  const flattenObject = (obj, str = '{') => {
    Object.keys(obj).forEach(function (key) {
      str += `${key}: ${flattenText(obj[key])}, `;
    });
    return `${str.slice(0, str.length - 2)}}`;
  };

  let config = JSON.stringify(props.options, (key, value) => {
    return typeof value === 'function' ? value.toString() : value;
  });

  config = JSON.parse(config);
  const concatHTML = `${init}${flattenObject(config)}${end}`.replace(
    ': }',
    ': {}'
  );

  return (
    <WebView
      style={[props.styles, props.webviewStyles]}
      source={{ html: concatHTML }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      scalesPageToFit={true}
      scrollEnabled={false}
      automaticallyAdjustContentInsets={true}
      {...props}
    />
  );
};

export default Highcharts;
