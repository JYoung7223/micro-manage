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
    const [allChecklists, setAllChecklists] = useState([]);
    const [checklistTemplates, setChecklistTemplates] = useState([]);
    const [currentChecklists, setCurrentChecklists] = useStickyState([], 'currentChecklist');

    const { user } = useContext(UserContext);

    useEffect(() => {
        getChecklists();
    }, []);

    const getChecklists = async () => {
        const allChecklistsResponse = await API.getChecklists();

        setAllChecklists(allChecklistsResponse.data);
        setChecklistTemplates(allChecklistsResponse.data.filter(ck => !ck.template));
    }

    const goToUpdateChecklist = async (id) => {
        window.location = `/checklist/${id}`;
    }

    const fillOutChecklist = async (id) => {
        //If the user is filling out the checklist, copy it and send them to the page
        let checklist = allChecklists.filter(ck => ck._id === id);
        if(checklist.length === 0)
            return;
        let newChecklist = _.cloneDeep(checklist[0]);
        delete newChecklist._id;
        delete newChecklist.created_date;
        newChecklist.template = id;

        newChecklist = await API.saveChecklist(newChecklist);

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
        setChecklistTemplates([{...newChecklist, owner: user._id}, ...checklistTemplates]);
    }

    const saveChecklist = async(checklist) => {
        if(!checklist._id)
            delete checklist._id;
        const newChecklist = await API.saveChecklist(checklist);

        getChecklists();
        goToUpdateChecklist(newChecklist._id);
        return newChecklist;
    };

    const updateChecklist = async(checklist) => {
        const updatedChecklist = await API.updateChecklist(checklist);

        getChecklists();
    }

    const deleteChecklist = async(checklistId) => {
        const deleteChecklist = await API.deleteChecklist(checklistId);
        getChecklists();
    }

    return (
        <>
            <Grid container>
                <Grid item>
                    <Button variant="contained" size="small" onClick={e => createNewChecklist()}>New Checklist Template</Button>
                </Grid>
            </Grid>
            <List>
                {
                    checklistTemplates.map(checklist => {
                        return (<ListItem key={checklist._id + 'li'}>
                            <ChecklistCard
                                title={checklist.title}
                                fillOut={fillOutChecklist}
                                update={goToUpdateChecklist}
                                continue={continueCurrentChecklist}
                                deleteChecklist={deleteChecklist}
                                canContinue={currentChecklists.find(ck => ck.template === checklist._id)}
                                canFillOut={checklist.phases.length > 0}
                                id={checklist._id}
                                key={checklist._id}
                                saveChecklist={(title) => saveChecklist({...checklist, title})}
                                updateChecklist={(title) => updateChecklist({...checklist, title})}
                                checklists={allChecklists.filter(ck => ck.template === checklist._id)}
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

