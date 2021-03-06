# Week 1: A detailed plan of action with the following:

1.  An overview of the intended application and WHY you feel it's valuable.
> * As a Manager, 
> * I want to make sure my minions follows my every command to the letter,
> * so that I may enforce my rule and dominion over my minions.

2. A breakdown of roles by group member.
> * Will - UX
> * Nate - Users, Back-End
> * Justin - Tasks

> Features
> - Checklist
>   - Has Sections, Tasks
> - Tasks
>   - Mark Task as completed, reviewed, signed-off
>   - Link task to template, resource, etc.
>   - Keep track of task statistics 
>       - time-open (this & on avg)
>       - time-to-sign-off (this & on avg)
>   - Structure
` 
{
    // Use built-in id,
    instruction: {
        type: DataTypes.STRING,
        allowNull: false
    },
    instructionReferenceId: {
        type: Schema.Types.ObjectId,
        references: {
            model: "checklist",
            key: "id"
        }
    }
}
`
>       - id,
>       - checklistGroupId
>       - checklistGroupLineId
>       - instruction
>       - instructionReferenceId
>       - templateReferenceId
>       - preparedId,
>       - reviewed,
>       - finalReview
> - Sections (Group of Tasks)
>   - Sequential grouping
>   - Customizable grouping (Function, Location, Resource, etc.)
>   - Structure
`
{
    // Use built-in id,
    checklistGroupLineId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}
`
> - Users
>   - Manager (Reviews, Sign-off tasks)
>   - Minion (completes tasks, submit for review)

> Technologies
> - React.js
> - Express.js
> - BootStrap
> - Material-UI
> - Mongoose - MongoDB

3. A schedule for completion of various tasks.
> * Feb 10 - Project Decided
> * Feb 13 - Project Setup Completed, Tasks started
> * Feb 20 - Back-End CRUD Complete & Front-end Structure/Wire-Frames complete,
> * Feb 27 - Users & Tasks Completed
> * Mar 6 - Functionality finalized & deployed to production
> * Mar 8 - Finishing touches complete & Presentation Ready

4. A screenshot of your Jira, Trello, or Project Management Board that shows breakdown of tasks assigned to group members with a schedule.
> ![Project Sample](./images/my_jira.png "Project Sample")

5. A set of DETAILED screen-by-screen design layouts with annotations describing all UI/UX components and all data relevant to the screen.
> * TBD