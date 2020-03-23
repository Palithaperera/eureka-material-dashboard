import React, { useEffect, useState } from 'react';
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import ServerTable from "components/Table/serverTable.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CircularProgress from '@material-ui/core/CircularProgress';
import eurekaService from "../../API/eurekaService";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';


import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);



export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    result: null,
    selectedServers: null,
    env: 'DEV',
    loading: true
  });
  //const [selectedServers, setSelectedServers] = useState(null);
  //const [env, setEnv] = React.useState(null);
  const getServices = async (environment) => {
    setDashboardData({
      result: dashboardData.data,
      selectedServers: null,
      env: environment,
      loading: true
    });
    console.log(environment);
    const response = await eurekaService(environment).get("/api/services");      
    setDashboardData({
      result: response.data,
      selectedServers: null,
      env: environment,
      loading: false
    });
  }

  useEffect(() => {
    getServices(dashboardData.env);    
  },[]);

  const fetchServers = async (serviceName) => {
    const obj = {... dashboardData};
    obj.loading = true;
    setDashboardData(obj);
    const response = await eurekaService(dashboardData.env).get(`/api/application/${serviceName}`);
    obj.loading = false;
    setDashboardData(obj);
    let serverDetails = response.data.map( (server) => {
      return { 
        hostName: server.hostName,
        healthUrl: server.healthUrl,
        ip: server.ip,
        healthData: server.healthData
      }
    } );

    //setSelectedServers(serverDetails);
    setDashboardData({
      result: dashboardData.result,
      selectedServers: serverDetails,
      env: dashboardData.env
    });
  }

  const handleChange = event => {
    getServices(event.target.value);
  }

  const handleClearClick = event => {
    setDashboardData({
      result: dashboardData.result,
      selectedServers: null,
      env: dashboardData.env,
      loading: false
    });
  }

  const getServiceArray= () => {
    let a = dashboardData.result.map((obj, index) => {
      return [(index + 1).toString(),obj.name, obj.instance.length.toString(), obj.instance[0].port.$.toString()]
    })
    return a
  }

  const renderServices = () => {
    return <Card>
            <CardHeader color="success">              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={10}>
                  <h4 className={classes.cardTitleWhite}>Service Stats</h4>
                  <p className={classes.cardCategoryWhite}>
                    Service health data on all services.
                  </p>
                </Grid>
                <Grid item xs={12} sm={2}>                  
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="uncontrolled-native">Environment</InputLabel>
                    <NativeSelect
                      defaultValue={dashboardData.env}
                      inputProps={{
                        name: 'ENV',
                        id: 'envSelect'
                      }}
                      onChange={handleChange}
                    >
                      <option value={'DEV'}>DEV</option>
                      <option value={'DEV2'}>DEV2</option>
                      <option value={'QA-INT'}>QA-INT</option>
                      <option value={'STG'}>STG</option>
                      <option value={'PRD'}>PRD</option>
                    </NativeSelect>
                  </FormControl>
                </Grid>
              </Grid>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["ID", "Name", "Instances", "Port"]}
                tableData={dashboardData.result}
                fetchServers={fetchServers}
              />
            </CardBody>
        </Card>
  }

  const renderServers = () => {
    return <Card>
              <CardHeader color="success">
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={10}>
                  <h4 className={classes.cardTitleWhite}>Server Stats</h4>
                  <p className={classes.cardCategoryWhite}>
                    Service health data on all servers.
                  </p>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                  <IconButton onClick={handleClearClick} color="primary" aria-label="upload picture" component="span">
                    <ClearIcon />
                  </IconButton>
                  </Grid>
                </Grid>
              </CardHeader>
              <CardBody>
                <ServerTable selectedServers={dashboardData.selectedServers}/>
              </CardBody>
          </Card>
  }
  
  const classes = useStyles();

  let content;

  if(!dashboardData.loading && dashboardData.result || dashboardData.selectedServers){
    content = <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
            {dashboardData.selectedServers ? renderServers() : renderServices()}
        </GridItem>
      </GridContainer>
  </div>
  }else {
    content =   <div className={classes.root}>
                  <div className={classes.placeholder}>
                    <Fade
                      in
                      style={{
                        transitionDelay: '80ms',
                      }}
                      unmountOnExit
                    >
                      <CircularProgress />
                    </Fade>
                  </div>
                </div>
  }

  
  
  return (
    <div>{content}</div>    
  );
}
