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
import useStickyState from "../../utils/StickyState";
import {Link} from "react-router-dom";
import DateTime from "luxon/src/datetime";
import './ChecklistCard.scss';

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
    const [viewChecklists, setViewChecklists] = useStickyState(false, 'view-' + props.id);

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

            if(prepareTasks.length <= allTasks.length)
            {
                setInProgressChecklists([...inProgressChecklists, ck]);
                return;
            }
        })
    }

    return (
        <Card className={classes.root}>
            <CardContent>

                <Grid container>
                    {
                        viewChecklists ?
                            <>
                                <Grid item md={12}>
                                    <Typography variant="h5" component="h5">
                                        {
                                            props.id ?
                                                <button className={'btn btn-secondary standard-format'}
                                                        onClick={e => {if(!user) return redirectToLogin(); return setViewChecklists(false);}}>View Template Phases</button> :
                                                ''
                                        }
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <em>Total:</em> {props.checklists.length}
                                        </ListItem>
                                        <ListItem>
                                            <em>Complete:</em> {completeChecklists.length}
                                            <List>
                                                {completeChecklists.map(ck => {
                                                    return <ListItem><Link to={"/checklist/" + ck._id}>{ck.title + ' Created on ' + DateTime.fromISO(ck.created_date).toFormat('LLL dd yyyy HH:mm')}</Link></ListItem>;
                                                })}
                                            </List>
                                        </ListItem>
                                        <ListItem>
                                            <em>Ready for Final Review:</em> {finalReviewChecklists.length}
                                            <List>
                                                {finalReviewChecklists.map(ck => {
                                                    return <ListItem><Link to={"/checklist/" + ck._id}>{ck.title + ' Created on ' + DateTime.fromISO(ck.created_date).toFormat('LLL dd yyyy HH:mm')}</Link></ListItem>;
                                                })}
                                            </List>
                                        </ListItem>
                                        <ListItem>
                                            <em>Ready for Review:</em> {reviewChecklists.length}
                                            <List>
                                                {reviewChecklists.map(ck => {
                                                    return <ListItem><Link to={"/checklist/" + ck._id}>{ck.title + ' Created on ' + DateTime.fromISO(ck.created_date).toFormat('LLL dd yyyy HH:mm')}</Link></ListItem>;
                                                })}
                                            </List>
                                        </ListItem>
                                        <ListItem>
                                            <em>In Progress:</em> {inProgressChecklists.length}
                                            <List>
                                                {inProgressChecklists.map(ck => {
                                                    return <ListItem><Link to={"/checklist/" + ck._id}>{ck.title + ' Created on ' + DateTime.fromISO(ck.created_date).toFormat('LLL dd yyyy HH:mm')}</Link></ListItem>;
                                                })}
                                            </List>
                                        </ListItem>
                                    </List>
                                </Grid>
                            </> :
                            <>
                                <Grid item md={8} style={ {paddingRight: '5px'} } >
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
                                                        style={ {marginBottom: '10px'} }
                                                    />
                                                    <button className='btn btn-info standard-format' onClick={e => {
                                                        if(props.id)
                                                            props.updateChecklist(checklistTitle);
                                                        else {
                                                            props.saveChecklist(checklistTitle);
                                                        }
                                                        setEditingTitle(false);
                                                    }}>Save Title</button>
                                                </> :
                                                <>
                                                    {checklistTitle}
                                                    <button className={'btn btn-info standard-format'} onClick={e => {if(!user) return redirectToLogin(); return setEditingTitle(true);}}>Update Checklist Title</button>
                                                    <button className={'btn btn-danger standard-format'} onClick={e => {if(!user) return redirectToLogin(); return props.deleteChecklist(props.id)}}>Delete Checklist</button>
                                                </>
                                        }
                                    </Typography>
                                    <Typography variant="body2" component="div">
                                        {
                                            props.children
                                        }
                                    </Typography>
                                </Grid>
                                <Grid item md={4}>
                                    <Typography variant="h5" component="h5">
                                        {`${checklistTitle}(s) Statistics`}
                                        {
                                            props.id ?
                                                <button className={'btn btn-secondary standard-format'} onClick={e => {if(!user) return redirectToLogin(); return setViewChecklists(true);}}>View Template Copies</button> :
                                                ''
                                        }
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
                            </>
                    }
                </Grid>
            </CardContent>
            <CardActions>
                {
                    props.canContinue ?
                        <button className={'btn btn-info'} onClick={e => {if(!user) return redirectToLogin(); return props.continue(props.id)}}>Open Last Created Copy</button> :
                        ''
                }
                {
                    props.canFillOut ?
                        <button className={'btn btn-success'} onClick={e => {if(!user) return redirectToLogin(); return props.fillOut(props.id)}}>Create a copy of this template</button> :
                        ''
                }
                <button className={'btn btn-info'} onClick={e => {if(!user) return redirectToLogin(); return props.update(props.id)}}>Update Template</button>
            </CardActions>
        </Card>
    );
}