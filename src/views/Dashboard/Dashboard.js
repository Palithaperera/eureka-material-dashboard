import React, { useEffect, useState } from 'react';
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import { bugs, website, server } from "variables/general.js";

import eurekaService from "../../API/eurekaService";


import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);



export default function Dashboard() {
  const [result, setResult] = useState(null);

  const renderServices = () => {
    let a = result.map((obj, index) => {
      return [index + 1,obj.name, obj.instance.length, obj.instance[0].port.$.toString()]
    })
  return a
  }

  useEffect( () => {
    let getServices = async () => {
      const response = await eurekaService.get("/api/services");      
      setResult(response.data);
      console.log(response.data);
    }

    getServices();    
  },[]);

  const classes = useStyles();

  let content;

  if(result){
    content = <div>    
  
  <GridContainer>
    <GridItem xs={12} sm={12} md={6}>
        <Card>
          <CardHeader color="warning">
            <h4 className={classes.cardTitleWhite}>Service Stats</h4>
            <p className={classes.cardCategoryWhite}>
              Service health data on all services.
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="warning"
              tableHead={["ID", "Name", "Instances", "Port"]}
              tableData={renderServices()}
            />
          </CardBody>
        </Card>
    </GridItem>
  </GridContainer>
</div>
  }else {
    content = <div>Loading ....</div>
  }

  
  
  return (
    <div>{content}</div>    
  );
}
