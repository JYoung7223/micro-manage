import React, {useEffect, useState} from 'react';
import axios from 'axios';
import List from '../../components/List/List';
import ListItem from '../../components/List/ListItem';

export default function ChecklistManagement() {
    const [checklists, setChecklists] = useState([]);

    useEffect(() => {
        getChecklists();
    }, []);

    const getChecklists = async () => {
        const checklistsResponse = await axios.get('/api/checklists');

        setCheckilsts(checklistsResponse.data);
    }

    return (
        <List>
            {
                checklists.map(checklist => {
                    <ListItem>
                        <a href={`/checklist/${checklist.id}`}>{checklist.title}</a>
                    </ListItem>
                })
            }
        </List>
    )
}

