import * as qs from 'qs';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { Accordion, AccordionTitleProps, Form, Input, Menu } from 'semantic-ui-react';
import { RootState } from '../redux/reducers';


export enum ProfSortOptions {
  professor = 'professor',
  campus = 'campus',
  recommended = 'recommended',
  clarity = 'clarity',
  engaging = 'engaging'
}
export interface ProfFilterQuery {
  name?: string;
  department?: string;
  campus?: string;
  ascending?: 'ascending' | 'descending';
  sort?: ProfSortOptions;
}

export const parseProfQueryFromUrl = (url: string): ProfFilterQuery => {
  const { department, campus, name, ascending, sort } = qs.parse(url.slice(1));
  const newProfFilterObj = {} as ProfFilterQuery;
  if (department) {
    newProfFilterObj.department = department as string;
  }
  if (campus) {
    newProfFilterObj.campus = campus.toString().toLowerCase();
  }
  if (name) {
    newProfFilterObj.name = name.toString().toLowerCase();
  }
  if (ascending) {
    newProfFilterObj.ascending = ascending.toString().toLowerCase() as 'ascending' | 'descending';
  }
  if (sort) {
    newProfFilterObj.sort = sort.toString().toLowerCase() as ProfSortOptions;
  }
  return newProfFilterObj;
}
interface AccordionState {
  department: boolean;
  campus: boolean;
  queryStatus: ProfFilterQuery;
  searchString: string;
}
export const parseUrlFromProfQueryObj = (query: ProfFilterQuery): string => {
  return qs.stringify(query);
}

export const ProfessorFilters = () => {
  const location = useLocation();
  const queryStatus = parseProfQueryFromUrl(location.search);
  const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);
  const [accordionState, updateAccordion] = useState({
    department: queryStatus.department ? true : false,
    campus: queryStatus.campus ? true : false,
    queryStatus,
    searchString: queryStatus.name || '',
  } as AccordionState);

  const campuses = [
    { name: 'St. George', value: 'utsg' },
    { name: 'Mississauga', value: 'utm' },
    { name: 'Scarborough', value: 'utsc' }
  ]
  const CampusFilter = (
    <Form inverted={darkmode}>
      <Form.Group grouped>
        {campuses.map((campus) => <Form.Checkbox
          label={campus.name}
          value={campus.value}
          checked={queryStatus.campus === campus.value.toLowerCase()}
          name={campus.name}
          onClick={(_e, data) => {
            let toReplace: string | undefined;
            if (data.checked) {
              toReplace = campus.value.toLowerCase();
            }
            updateAccordion(accordion => ({
              ...accordion,
              queryStatus: {
                ...queryStatus,
                campus: toReplace,
                name: accordion.searchString
              }
            }))
          }}
        />)}
      </Form.Group>
    </Form>
  )


  const handleAccordion = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: AccordionTitleProps) => {
    updateAccordion(oldAccordianState => ({
      ...oldAccordianState,
      [data.index as string]: !data.active
    }));
  }
  if (JSON.stringify(accordionState.queryStatus) !== JSON.stringify(parseProfQueryFromUrl(location.search))) {
    return <Redirect to={`/browse/professors?${parseUrlFromProfQueryObj(accordionState.queryStatus)}`} />
  }

  return <Accordion
    vertical
    inverted={darkmode}>
    <Menu.Item>
      <label>Professor Name </label><br />
      <Input
        style={{ fontSize: '1em', width: '70%' }}
        action={{
          icon: 'search',
          onClick: () => {
            updateAccordion(accordion => {
              return {
                ...accordion,
                queryStatus: {
                  ...accordion.queryStatus,
                  name: accordion.searchString,
                }
              }
            })
          }
        }}
        value={accordionState.searchString}
        onChange={(event, data) => {
          event.persist();
          updateAccordion(accordion => {
            return {
              ...accordion,
              searchString: data.value.toLowerCase().replace(/,|\.|\?|\//g, '')
            }
          })
        }}
        placeholder='Name...'
      />
    </Menu.Item>
    <br />
    <Menu.Item>
      <Accordion.Title
        active={accordionState.campus}
        content='Campus'
        index='campus'
        onClick={handleAccordion}
      />
      <Accordion.Content className='accordionContent' active={accordionState.campus} content={CampusFilter} />
    </Menu.Item>
  </Accordion>
}