import * as React from 'react';
import MembershipModel from '../models/membershipModel';
import { IActivityListItem } from '../api/responses';
import ListItemMission from './ListItemMission';
import ActivityListItemModel from '../models/activityListItemModel';
import { useParams, Switch, Route, useRouteMatch } from 'react-router-dom';
import ViewActivity from './ViewActivity';
import { makeStyles } from '@material-ui/core';
import moment from "moment";

const useStyles = makeStyles(theme => ({
  cardsContainer: {
    margin: "24px"
  },
  card: {
    marginBottom: "24px"
  }
}));

const AllMissions = (props: {
  membership: MembershipModel
}) => {
  
  const classes = useStyles();
  const [missions, setMissions] = React.useState<ActivityListItemModel[] | undefined>(undefined);
  let { path, url } = useRouteMatch();
  
  React.useEffect(() => {

    async function loadAsync() {

      var draftMissions = await props.membership.getMissionsAsync({
        published: false,
      });
      
      var publishedMissions = await props.membership.getMissionsAsync({
        published: true,
        after: moment().subtract(2,'months').toISOString() // 2 months from today
      });

      var missions: ActivityListItemModel[] = [];
      
      publishedMissions.forEach((mission) => {
        missions.splice(0, 0, mission);
        
      });
      
      draftMissions.forEach((mission) => {
        if (mission.date) {
          missions.splice(0, 0, mission);
        }
        
      });
        

      setMissions(missions);
      
    }

    loadAsync();
  }, [props.membership]);

  if (missions === undefined) {
    return <p>Loading...</p>
  }

  const ViewMissionHandler = () => {
    let { missionId } = useParams();

    var mission = missions.find(i => i.id.toString() === missionId);
    if (mission) {
      return <p>Not implemented</p>
      // return <ViewActivity membership={props.membership} activity={mission}/>
    } else {
      return <p>Loading...</p>
    }
  }

  return (
    <Switch>
      <Route path={`${path}/:missionId`} children={<ViewMissionHandler/>}/>
      <Route path={path}>
        <div className={classes.cardsContainer}>
          {missions.map((mission) => (
            <div className={classes.card} key={mission.id}>
              <ListItemMission mission={mission}/>
              
            </div>
          ))}
        </div>
      </Route>
    </Switch>
  );
}

export default AllMissions;