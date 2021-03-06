import React, {useEffect, useState} from 'react';
import axios from 'axios';
import List from '../../components/List/List';
import ListItem from '../../components/List/ListItem';
import ChecklistCard from "../../components/ChecklistCard/ChecklistCard";
import useStickyState from "../../utils/StickyState";
import _ from 'lodash';

export default function ChecklistManagement() {
    const [checklists, setChecklists] = useState([]);
    const [currentChecklists, setCurrentChecklists] = useStickyState([], 'currentChecklist')

    useEffect(() => {
        getChecklists();
    }, []);

    const getChecklists = async () => {
        const checklistsResponse = await axios.get('/api/checklists');

        setChecklists(checklistsResponse.data);
    }

    const updateChecklist = async (id) => {
        window.location = `/checklist/${id}`;
    }

    const fillOutChecklist = async (id) => {
        //If the user is filling out the checklist, copy it and send them to the page
        let checklist = checklists.filter(ck => ck.id === id);
        if(checklist.length === 0)
            return;
        let newChecklist = _.cloneDeep(checklist[0]);
        newChecklist.id = 'newChecklist';
        newChecklist.template = id;

        setCurrentChecklists([...currentChecklists, newChecklist]);
    }

    const continueCurrentChecklist = async (id) => {
        let currentChecklist = currentChecklists.filter(ck => ck.template === id);
        if(currentChecklist === 0)
            return;

        window.location = `/checklist/${currentChecklist[0].id}`;
    }

    return (
        <List>
            {
                checklists.map(checklist => {
                    return (<ListItem key={checklist._id + 'li'}>
                        <ChecklistCard
                            title={checklist.title}
                            fillOut={fillOutChecklist}
                            update={updateChecklist}
                            continue={continueCurrentChecklist}
                            canContinue={currentChecklists.find(ck => ck.template === checklist.id || ck.template === checklist._id)}
                            id={checklist._id}
                            key={checklist._id}
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
    )
}

