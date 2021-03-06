import React from 'react';
import { Dropdown, DropdownProps, Grid } from 'semantic-ui-react';
import { ProfReviewModal } from './ProfReviewModal';

export const ProfActionBar = (props: {
    index: number,
    options: { orderBy: string, ascending: boolean }[],
    onChange: (event: React.SyntheticEvent<HTMLElement, Event>,
        data: DropdownProps) => void,
    darkmode: boolean,
    professor: string,
}) => {

    return <div>
        <Grid columns={2} stackable>
            <Grid.Row textAlign='left'>
                <Grid.Column>
                    <ProfReviewModal professor={props.professor} />
                </Grid.Column>
                <Grid.Column textAlign='right'>
                    <label>Sort by: </label>
                    <Dropdown
                        onChange={props.onChange}
                        selection
                        style={props.darkmode ? { color: 'white', backgroundColor: 'gray' } : {}}
                        text={`${props.options[props.index].orderBy} (${props.options[props.index].ascending ? 'Ascending' : 'Descending'})`}
                        value={JSON.stringify(props.options[props.index])}
                        options={props.options.map((val) => {
                            return {
                                text: `${val.orderBy} (${val.ascending ? 'Ascending' : 'Descending'})`,
                                value: JSON.stringify(val)
                            }
                        })} />
                </Grid.Column>
            </Grid.Row>
        </Grid>
        <br />
    </div>

}