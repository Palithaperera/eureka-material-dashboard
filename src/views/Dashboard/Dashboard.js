import React, { useEffect, useState } from 'react';
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import ServerTable from "components/Table/serverTable.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import eurekaService from "../../API/eurekaService";


import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);



export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [selectedServers, setSelectedServers] = useState(null);

  useEffect( () => {
    let getServices = async () => {
      const response = await eurekaService('dev').get("/api/services");      
      setResult(response.data);
    }

    getServices();    
  },[]);

  const fetchServers = async (serviceName) => {
    const response = await eurekaService.get(`/api/application/${serviceName}`);
    let serverDetails = response.data.map( (server) => {
      return { 
        hostName: server.hostName,
        healthUrl: server.healthUrl,
        ip: server.ip,
        healthData: server.healthData
      }
    } );

    setSelectedServers(serverDetails);
  }

  const getServiceArray= () => {
    let a = result.map((obj, index) => {
      return [index + 1,obj.name, obj.instance.length, obj.instance[0].port.$.toString()]
    })
    return a
  }

  const renderServices = () => {
    return <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Service Stats</h4>
              <p className={classes.cardCategoryWhite}>
                Service health data on all services.
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["ID", "Name", "Instances", "Port"]}
                tableData={getServiceArray()}
                fetchServers={fetchServers}
              />
            </CardBody>
        </Card>
  }

  const renderServers = () => {
    return <Card>
              <CardHeader color="success">
                <h4 className={classes.cardTitleWhite}>Server Stats</h4>
                <p className={classes.cardCategoryWhite}>
                  Service health data on all servers.
                </p>
              </CardHeader>
              <CardBody>
                <ServerTable selectedServers={selectedServers}/>
              </CardBody>
          </Card>
  }
  
  const classes = useStyles();

  let content;

  if(result || selectedServers){
    content = <div>    
  
  <GridContainer>
    <GridItem xs={12} sm={12} md={12}>
        {selectedServers ? renderServers() : renderServices()}
    </GridItem>
  </GridContainer>
</div>
  }else {
    content = <Backdrop open>
    <CircularProgress color='#fff'/>
  </Backdrop>
  }

  
  
  return (
    <div>{content}</div>    
  );
}
