import React, { useState } from 'react';
import lab4 from './lab4-extended-app.png';
import { FormItem, FileUploader, InlineLoading, TextInput, Grid, Column, FormLabel } from '@carbon/react';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from '@carbon/react';
import axios from 'axios';


const LandingPage = () => {

  let [rows, setRows] = useState([]);
  // let [length, setLength] = useState([]);
  let [statusFlag, setStatusFlag] = useState("inactive");
  let url = sessionStorage.getItem("item_key");

  const headers = [
    {
      key: 'id',
      header: '#',
    },
    {
      key: 'region',
      header: 'REGION',
    },
    {
      key: 'total_cases',
      header: 'Total Cases',
    },
    {
      key: 'prediction',
      header: 'Prediction',
    },
    {
      key: 'probability',
      header: 'Probability',
    },
  ];

  const readFile = (file) => {
    const fileReader = new FileReader();
    if (file) {
      fileReader.onload = function (event) {


        const csvOutput = event.target.result;
        var lines = csvOutput.split("\n");
        var result = [];
        var test = JSON.stringify(lines[0].trim());
        if (test.match("REGION,Total_cases")) {
          setStatusFlag("active");
          for (var i = 1; i < lines.length; i++) {

            var currentline = lines[i].split(",");
            currentline[1] = currentline[1].trim();
            currentline[1] = parseInt(currentline[1]);
            result.push(currentline);

          }

          var payload = {
            "input": result
          };

          var data = JSON.stringify(payload);
          //console.log(data);

          let config = {
            method: 'post',
            url: url,//'https://qejaw22fak.execute-api.us-east-2.amazonaws.com/Prod/predictions/',
            headers: {
              'Content-Type': 'application/json'
            },
            data: data
          };
          setStatusFlag("active");
          axios(config).then((response) => {

            let values = response.data.values;
            values.forEach((o, i) => o.id = i + 1);
            rows = JSON.stringify(values);
            console.log(rows);
            // setLength(values.length);
            setRows(values);
            setStatusFlag("finished");
            const progressbar = document.getElementById("container");
            progressbar.style.display = "block";
          }).catch((error) => {
            setStatusFlag("error");
            //console.log(error);
          });
        } else {
          window.alert("Please upload a valid file");
        }
      };
      fileReader.readAsText(file);
    }

  };

  return (
    <>
      <Grid>
        <Column lg={8} md={8} sm={4}>
          <FormItem id="formik">
            <div className="cds--file__container">
              <FormLabel><strong>Enter Amazon API Gateway Endpoint URL</strong></FormLabel>
              <br></br>
              <TextInput type="text" required id="name" className="nameCon"
                onBlur={function uploadFile(event) {
                  url = event.target.value;
                  if (event.target.value.match("https?://.+") == null) {
                    window.alert("Please enter valid url");
                    const progressbar = document.getElementById("upload");
                    progressbar.disabled = true;
                  }
                  if (event.target.value == null) {
                    window.alert("Please enter valid url");
                    document.getElementById("upload").disabled = true;
                  }

                }}
              />
              <br></br>
              <FormLabel><strong>Upload dataset file</strong></FormLabel>
              <FileUploader
                accept={['text/csv']}
                buttonLabel="Upload"
                filenameStatus="edit"
                iconDescription="Delete file"
                labelDescription="Maximum file size is 5MB and supported file type is .csv files  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;"
                id="upload"
                onChange={function uploadFile(event) {
                  let file = event.target.files[0];
                  let field = true;
                  sessionStorage.setItem("item_key", url);
                  //console.log(url)

                  if (!file && !file.name) {
                    window.alert("Please upload a file smaller than 5 MB");
                    field = false;
                  }
                  if (file.size > 5e6) {
                    window.alert("Please upload a file smaller than 5 MB");
                    field = false;

                  } if (field === true) {
                    readFile(file)
                  }

                }}
                onClick={function noRefCheck(event) {

                }}
                onDelete={function noRefCheck() { }}
                role="button"
                size="md"
              />
              <InlineLoading status={statusFlag}> </InlineLoading>
            </div>
          </FormItem>

        </Column>
        <Column lg={8} md={8} sm={4}>
          <FormLabel align="center">
          <strong>Architecture Overview</strong>
             <br></br>
                <img alt='architecture' src={lab4} width="100%" value="ggg"></img></FormLabel>
          
          
        
               
        </Column>
        <Column lg={6} md={8} sm={4}>
          <div id="container">
          <DataTable rows={rows} headers={headers} >
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
              <Table {...getTableProps()} >
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DataTable>
          </div>
        </Column>
      </Grid>
    </>

  );
};

export default LandingPage;








































