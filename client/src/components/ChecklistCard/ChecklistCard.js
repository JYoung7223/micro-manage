import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {props.title}
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
                <Button variant="contained" size="small" onClick={e => props.fillOut(props.id)}>Fill out</Button>
                <Button variant="contained" size="small" onClick={e => props.update(props.id)}>Update</Button>
            </CardActions>
        </Card>
    );
}