import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import List from '../../components/List/List';
import ListItem from '../../components/List/ListItem';
import ChecklistCard from "../../components/ChecklistCard/ChecklistCard";
import useStickyState from "../../utils/StickyState";
import _ from 'lodash';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {redirectToLogin, UserContext} from "../../utils/userContext";
import API from "../../utils/API";

const newChecklist = {_id: '', title: '', phases: []}

export default function ChecklistManagement() {
    const [checklists, setChecklists] = useState([]);
    const [currentChecklists, setCurrentChecklists] = useStickyState([], 'currentChecklist');

    const { user } = useContext(UserContext);

    useEffect(() => {
        getChecklists();
    }, []);

    const getChecklists = async () => {
        const checklistsResponse = await API.getChecklists();

        setChecklists(checklistsResponse.data);
    }

    const goToUpdateChecklist = async (id) => {
        window.location = `/checklist/${id}`;
    }

    const fillOutChecklist = async (id) => {
        //If the user is filling out the checklist, copy it and send them to the page
        let checklist = checklists.filter(ck => ck._id === id);
        if(checklist.length === 0)
            return;
        let newChecklist = _.cloneDeep(checklist[0]);
        delete newChecklist._id;
        newChecklist.template = id;

        newChecklist = await saveChecklist(newChecklist);

        setCurrentChecklists([...currentChecklists, newChecklist]);

        goToUpdateChecklist(newChecklist._id);
    }

    const continueCurrentChecklist = async (id) => {
        let currentChecklist = currentChecklists.filter(ck => ck.template === id);
        if(currentChecklist === 0)
            return;

        window.location = `/checklist/${currentChecklist[0]._id}`;
    }

    const createNewChecklist = async() => {
        if(!user)
            return redirectToLogin();
        setChecklists([{...newChecklist, owner: user._id}, ...checklists]);
    }

    const saveChecklist = async(checklist) => {
        if(!checklist._id)
            delete checklist._id;
        const updatedChecklist = await API.saveChecklist(checklist);

        getChecklists();
    };

    const deleteChecklist = async(checklistId) => {
        const deleteChecklist = await API.deleteChecklist(checklistId);
        getChecklists();
    }

    return (
        <>
            <Grid container>
                <Grid item>
                    <Button variant="contained" size="small" onClick={e => createNewChecklist()}>New Checklist</Button>
                </Grid>
            </Grid>
            <List>
                {
                    checklists.map(checklist => {
                        return (<ListItem key={checklist._id + 'li'}>
                            <ChecklistCard
                                title={checklist.title}
                                fillOut={fillOutChecklist}
                                update={goToUpdateChecklist}
                                continue={continueCurrentChecklist}
                                deleteChecklist={deleteChecklist}
                                canContinue={currentChecklists.find(ck => ck.template === checklist.id || ck.template === checklist._id)}
                                canFillOut={checklist.phases.length > 0}
                                id={checklist._id}
                                key={checklist._id}
                                saveChecklist={(title) => saveChecklist({...checklist, title})}
                            >
                                <List>
                                    {
                                        checklist.phases.map((phase, index) => {
                                            if(index > 2)
                                                return;
                                            return (<ListItem key={`phase${index}`}>{phase.title}</ListItem>)
                                        })
                                    }
                                </List>
                            </ChecklistCard>
                        </ListItem>)
                    })
                }
            </List>
        </>
    )
}

