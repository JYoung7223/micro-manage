import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";

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
                                    props.saveChecklist(checklistTitle);
                                    setEditingTitle(false);
                                }}>Save Title</Button>
                            </> :
                            <>
                                {checklistTitle}
                                <Button variant="contained" size="small" onClick={e => setEditingTitle(true)}>Edit Title</Button>
                            </>
                    }
                    <Button variant="contained" size="small" color="secondary" style={{float: 'right'}} onClick={e => props.deleteChecklist(props.id)}>Delete</Button>
                </Typography>
                <Typography variant="body2" component="div">
                    {props.children}
                </Typography>
            </CardContent>
            <CardActions>
                {
                    props.canContinue ?
                        <Button variant="contained" size="small" onClick={e => props.continue(props.id)}>Continue Last</Button> :
                        ''
                }
                {
                    props.canFillOut ?
                        <Button variant="contained" size="small" onClick={e => props.fillOut(props.id)}>Fill out</Button> :
                        ''
                }
                <Button variant="contained" size="small" onClick={e => props.update(props.id)}>Update</Button>
            </CardActions>
        </Card>
    );
}