import React, {useContext, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import {redirectToLogin, UserContext} from "../../utils/userContext";
import Grid from "@material-ui/core/Grid";
import List from "../List/List";
import ListItem from "../List/ListItem";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function ChecklistCard(props) {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const [editingTitle, setEditingTitle] = useState(props.title ? false : true);
    const [checklistTitle, setChecklistTitle] = useState(props.title);
    const { user } = useContext(UserContext);
    const [completeChecklists, setCompleteChecklists] = useState([]);
    const [finalReviewChecklists, setFinalReviewChecklists] = useState([]);
    const [reviewChecklists, setReviewChecklists] = useState([]);
    const [inProgressChecklists, setInProgressChecklists] = useState([]);

    useEffect(() => {
        getChecklistStatus();
    }, []);

    const getChecklistStatus = () => {
        props.checklists.map((ck) => {
            let allTasks = [];
            ck.phases.map(phase => {
                allTasks.push(...phase.tasks);
            })

            let completeTasks = allTasks.filter(tk => tk.preparedBy && tk.reviewedBy && tk.finalReviewedBy);
            let finalReviewTasks = allTasks.filter(tk => tk.preparedBy && tk.reviewedBy && !tk.finalReviewedBy);
            let reviewTasks = allTasks.filter(tk => tk.preparedBy && !tk.reviewedBy && !tk.finalReviewedBy);
            let prepareTasks = allTasks.filter(tk => !tk.preparedBy && !tk.reviewedBy && !tk.finalReviewedBy);

            if(completeTasks.length === allTasks.length)
            {
                setCompleteChecklists([...completeChecklists, ck]);
                return;
            }

            if(finalReviewTasks.length === allTasks.length)
            {
                setFinalReviewChecklists([...finalReviewChecklists, ck]);
                return;
            }

            if(reviewTasks.length === allTasks.length)
            {
                setReviewChecklists([...reviewChecklists, ck]);
                return;
            }

            if(prepareTasks.length === allTasks.length)
            {
                setInProgressChecklists([...inProgressChecklists, ck]);
                return;
            }
        })
    }

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {
                        editingTitle ?
                            <>
                                <TextField
                                    id="outlined-basic"
                                    label="Checklist Title"
                                    variant="outlined"
                                    value={checklistTitle}
                                    onChange={(e) => setChecklistTitle(e.currentTarget.value)}
                                />
                                <Button variant="contained" size="small" onClick={e => {
                                    if(props.id)
                                        props.updateChecklist(checklistTitle);
                                    else
                                        props.saveChecklist(checklistTitle);
                                    setEditingTitle(false);
                                }}>Save Title</Button>
                            </> :
                            <>
                                {checklistTitle}
                                <Button variant="contained" size="small" onClick={e => {if(!user) return redirectToLogin(); return setEditingTitle(true);}}>Edit Title</Button>
                            </>
                    }
                    <Button variant="contained" size="small" color="secondary" style={{float: 'right'}} onClick={e => {if(!user) return redirectToLogin(); return props.deleteChecklist(props.id)}}>Delete</Button>
                </Typography>
                <Grid container>
                    <Grid item md={10}>
                        <Typography variant="body2" component="div">
                            {props.children}
                        </Typography>
                    </Grid>
                    <Grid item md={2}>
                        <Typography variant="h5" component="h5">
                            {`${checklistTitle}(s)`}
                        </Typography>
                        <List>
                            <ListItem>
                                <em>Total:</em> {props.checklists.length}
                            </ListItem>
                            <ListItem>
                                <em>Complete:</em> {completeChecklists.length}
                            </ListItem>
                            <ListItem>
                                <em>Ready for Final Review:</em> {finalReviewChecklists.length}
                            </ListItem>
                            <ListItem>
                                <em>Ready for Review:</em> {reviewChecklists.length}
                            </ListItem>
                            <ListItem>
                                <em>In Progress:</em> {inProgressChecklists.length}
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                {
                    props.canContinue ?
                        <Button variant="contained" size="small" onClick={e => {if(!user) return redirectToLogin(); return props.continue(props.id)}}>Continue Last</Button> :
                        ''
                }
                {
                    props.canFillOut ?
                        <Button variant="contained" size="small" onClick={e => {if(!user) return redirectToLogin(); return props.fillOut(props.id)}}>Fill out</Button> :
                        ''
                }
                <Button variant="contained" size="small" onClick={e => {if(!user) return redirectToLogin(); return props.update(props.id)}}>Update</Button>
            </CardActions>
        </Card>
    );
}