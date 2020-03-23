import React from "react";
import JSONTree from 'react-json-tree'
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/tableHead";
// core components
import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";

const useStyles = makeStyles(styles);

export default function Tasks(props) {
  const classes = useStyles();
  const { selectedServers } = props;
  return (
    <Table className={classes.table}>
      <TableHead className={classes.tableHead}>
            <TableRow className={classes.tableHeadRow}>
            <TableCell className={classes.TableCell}>
                Host Name
            </TableCell>
            <TableCell className={classes.TableCell}>
                Health URL
            </TableCell>
            <TableCell className={classes.TableCell}>
                IP
            </TableCell>
            <TableCell className={classes.TableCell}>
                Health Data
            </TableCell>
            </TableRow>
        </TableHead>
      <TableBody>
        {selectedServers.map(value => (
          <TableRow key={value} className={classes.tableRow}>
            <TableCell className={classes.TableCell}>
                { value.hostName }
            </TableCell>
            <TableCell className={classes.TableCell}>
                { value.healthUrl }
            </TableCell>
            <TableCell className={classes.TableCell}>
                { value.ip }
            </TableCell>
            <TableCell className={classes.TableCell}>
                {value.healthData ? <JSONTree data={value.healthData} /> : <p>No Health Data.</p>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
