import * as qs from 'qs';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { Accordion, AccordionTitleProps, Form, Input, Label, Menu } from 'semantic-ui-react';
import { RootState } from '../redux/reducers';
export enum CourseSortOptions {
  courseCode = 'courseCode',
  courseName = 'courseName',
  recommended = 'recommended',
  difficulty = 'difficulty',
  workload = 'workload'
}


export interface CourseFilterQuery {
  utsc_breadth?: string[];
  utm_distribution?: string[];
  arts_and_science_breadth?: string[];
  course?: string;
  campus?: string[];
  level?: string[];
  term?: string[];
  [key: string]: string[] | string | undefined;
  ascending?: 'ascending' | 'descending';
  sort?: CourseSortOptions;
}

export const removeFromList = <T extends unknown>(list: T[], index: number): T[] => {
  return list.slice(0, index).concat(list.slice(index + 1));
}

export const parseQueryFromUrl = (url: string): CourseFilterQuery => {
  const { utsc_breadth, utm_distribution, arts_and_science_breadth,
    course, campus, level, term, ascending, sort } = qs.parse(url.slice(1));
  const newCourseFilterObj = {} as CourseFilterQuery;
  if (utsc_breadth) {
    newCourseFilterObj.utsc_breadth = utsc_breadth as string[];
  }
  if (utm_distribution) {
    newCourseFilterObj.utm_distribution = utm_distribution as string[];
  }
  if (arts_and_science_breadth) {
    newCourseFilterObj.arts_and_science_breadth = arts_and_science_breadth as string[];
  }
  if (course) {
    newCourseFilterObj.course = course.toString().toLowerCase();
  }
  if (campus) {
    newCourseFilterObj.campus = campus as string[];
  }
  if (level) {
    newCourseFilterObj.level = level as string[]
  }
  if (ascending) {
    newCourseFilterObj.ascending = ascending.toString().toLowerCase() as 'ascending' | 'descending';
  }
  if (sort) {
    newCourseFilterObj.sort = sort as CourseSortOptions;
  }
  if (term) {
    newCourseFilterObj.term = term as string[]
  }
  return newCourseFilterObj;
}

interface AccordionState {
  breadth: {
    utm_distribution: boolean;
    arts_and_science_breadth: boolean;
    utsc_breadth: boolean;
    [key: string]: boolean;
  };
  campus: boolean;
  level: boolean;
  term: boolean;
  breadthHub: boolean;
  queryStatus: CourseFilterQuery;
  searchString: string;
}
export const parseUrlFromQueryObj = (query: CourseFilterQuery, toBackend = false): string => {
  if (toBackend) {
    const cleanQuery: CourseFilterQuery = {
      ...query,
      breadth: (query.utm_distribution || []).concat((query.utsc_breadth || []).concat(query.arts_and_science_breadth || [])),
      arts_and_science_breadth: undefined,
      utm_distribution: undefined,
      utsc_breadth: undefined
    }
    return qs.stringify(cleanQuery);
  }
  return qs.stringify(query);
}
export const CourseFilters = () => {
  const location = useLocation();
  const queryStatus = parseQueryFromUrl(location.search);
  const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);
  const [accordionState, updateAccordion] = useState({
    breadth: {
      utm_distribution: queryStatus.utm_distribution ? true : false,
      arts_and_science_breadth: queryStatus.arts_and_science_breadth ? true : false,
      utsc_breadth: queryStatus.utsc_breadth ? true : false,
    },
    campus: queryStatus.campus ? true : false,
    level: queryStatus.level ? true : false,
    term: queryStatus.term ? true : false,
    breadthHub: queryStatus.utm_distribution || queryStatus.arts_and_science_breadth || queryStatus.utsc_breadth ? true : false,
    queryStatus,
    searchString: queryStatus.course || '',
  } as AccordionState);

  const handleAccordion = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: AccordionTitleProps, breadth = false) => {
    if (breadth) {
      updateAccordion(oldAccordianState => ({
        ...oldAccordianState,
        breadth: {
          ...oldAccordianState.breadth,
          [data.index as string]: !data.active
        }
      }));
    } else {
      updateAccordion(oldAccordianState => ({
        ...oldAccordianState,
        [data.index as string]: !data.active
      }));
    }
  }

  const breadthOptions = [{
    campus: 'St. George',
    items: ['(5) The Physical and Mathematical Universes',
      '(4) Living Things and Their Environment',
      '(3) Society and its Institutions',
      '(2) Thought, Belief and Behaviour',
      '(1) Creative and Cultural Representation']
  }, {
    campus: 'Mississauga',
    items: ['Science',
      'Social Science',
      'Humanities']
  }, {
    campus: 'Scarborough',
    items: ['Arts, Literature & Language',
      'History, Philosophy & Cultural Studies',
      'Natural Sciences',
      'Quantitative Reasoning',
      'Social & Behavioural Sciences']
  }]
  const levels = [
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700'
  ]
  const terms = [
    'Fall',
    'Winter',
    'Summer'
  ]

  const campuses = [
    { name: 'St. George', value: 'utsg' },
    { name: 'Mississauga', value: 'utm' },
    { name: 'Scarborough', value: 'utsc' }
  ]
  const BreadthFilter = (campus: string, breadths: string[]) => <Form inverted={darkmode}>
    <Form.Group grouped >
      {breadths.map((breadth) => <Form.Checkbox
        label={breadth}
        value={breadth}
        checked={queryStatus[campus]?.includes(breadth.toLowerCase())}
        name={breadth}
        onClick={(_e, data) => {
          if (data.checked) {
            updateAccordion(accordion => ({
              ...accordion,
              queryStatus: {
                ...queryStatus,
                [campus]: [breadth.toLowerCase()].concat(accordion.queryStatus[campus] || []),
                course: accordion.searchString
              }
            }))
          } else {
            updateAccordion(accordion => {
              const newList = removeFromList(accordion.queryStatus[campus] as string[], accordion.queryStatus[campus]!.indexOf(breadth.toLowerCase()));
              return {
                ...accordion,
                queryStatus: {
                  ...queryStatus,
                  [campus]: newList,
                  course: accordion.searchString
                }
              }
            })
          }
        }}
      />)}
    </Form.Group>
  </Form>

  const CampusFilter = (
    <Form inverted={darkmode}>
      <Form.Group grouped>
        {campuses.map((campus) => <Form.Checkbox
          label={campus.name}
          value={campus.value}
          checked={queryStatus.campus?.includes(campus.value.toLowerCase())}
          name={campus.name}
          onClick={(_e, data) => {
            if (data.checked) {
              updateAccordion(accordion => ({
                ...accordion,
                queryStatus: {
                  ...queryStatus,
                  campus: [campus.value.toLowerCase()].concat(accordion.queryStatus.campus || []),
                  course: accordion.searchString
                }
              }))
            } else {
              updateAccordion(accordion => {
                const newList = removeFromList(accordion.queryStatus.campus!,
                  accordion.queryStatus.campus!.indexOf(campus.value.toLowerCase()));
                return {
                  ...accordion,
                  queryStatus: {
                    ...queryStatus,
                    campus: newList,
                    course: accordion.searchString
                  }
                }
              })
            }

          }}
        />)}
      </Form.Group>
    </Form>
  )
  const multiCampus = <Accordion inverted={darkmode}>
    {breadthOptions.map(({ campus, items }) => {
      const parsedString = campus === 'St. George' ? 'arts_and_science_breadth' : (campus === 'Mississauga' ? 'utm_distribution' : 'utsc_breadth');
      return <Menu.Item inverted={darkmode}>
        <Accordion.Title
          active={accordionState.breadth[parsedString]}
          content={campus}
          index={parsedString}
          onClick={(e, data) => { handleAccordion(e, data, true) }}
        />
        <Accordion.Content
          className='accordionContent'
          active={accordionState.breadth[parsedString]}
          content={BreadthFilter(parsedString, items)} />
      </Menu.Item>
    }
    )}
  </Accordion>

  const YearOfStudyFilter = (
    <Form inverted={darkmode}>
      <Form.Group grouped>
        {levels.map((level) => <Form.Checkbox
          label={level}
          name={level}
          value={level}
          checked={queryStatus.level?.includes(level)}
          onClick={(_e, data) => {
            if (data.checked) {
              updateAccordion(accordion => ({
                ...accordion,
                queryStatus: {
                  ...queryStatus,
                  level: [level].concat(accordion.queryStatus.level || []),
                  course: accordion.searchString
                }
              }))
            } else {
              updateAccordion(accordion => {
                const newList = removeFromList(accordion.queryStatus.level!, accordion.queryStatus.level!.indexOf(level));
                return {
                  ...accordion,
                  queryStatus: {
                    ...queryStatus,
                    level: newList,
                    course: accordion.searchString
                  }
                }
              })
            }
          }}
        />)}
      </Form.Group>
    </Form>
  )
  const TermFilter = (
    <Form inverted={darkmode}>
      <Form.Group grouped>
        {terms.map((term) => <Form.Checkbox
          label={term}
          name={term}
          value={term}
          checked={queryStatus.term?.includes(term.toLowerCase())}
          onClick={(_e, data) => {
            if (data.checked) {
              updateAccordion(accordion => ({
                ...accordion,
                queryStatus: {
                  ...queryStatus,
                  term: [term.toLowerCase()].concat(accordion.queryStatus.term || []),
                  course: accordion.searchString
                }
              }))
            } else {
              updateAccordion(accordion => {
                const newList = removeFromList(accordion.queryStatus.term!, accordion.queryStatus.term!.indexOf(term.toLowerCase()));
                return {
                  ...accordion,
                  queryStatus: {
                    ...queryStatus,
                    term: newList,
                    course: accordion.searchString
                  }
                }
              })
            }
          }}
        />)}
      </Form.Group>
    </Form>
  )


  if (JSON.stringify(accordionState.queryStatus) !== JSON.stringify(parseQueryFromUrl(location.search))) {
    return <Redirect to={`/browse?${parseUrlFromQueryObj(accordionState.queryStatus)}`} />
  }

  return <Accordion vertical inverted={darkmode}>
    <Menu.Item>
      <label>Course Subject Code </label><br />
      <Input
        maxLength={4}
        style={{ fontSize: '1em', width: '70%', marginTop: '10px' }}
        action={{
          icon: 'search',
          onClick: () => {
            updateAccordion(accordion => {
              return {
                ...accordion,
                queryStatus: {
                  ...accordion.queryStatus,
                  course: accordion.searchString,
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
        placeholder='CSC, BIO...'
      />
      {accordionState.searchString.length === 4 && <Label pointing='above' color='red'>4 Characters Max</Label>}
    </Menu.Item>
    <br />
    <Menu.Item inverted={darkmode}>
      <Accordion.Title
        active={accordionState.level}
        content='Course Level'
        index='level'
        onClick={handleAccordion}
      />
      <Accordion.Content className='accordionContent' active={accordionState.level} content={YearOfStudyFilter} />
    </Menu.Item>
    <Menu.Item>
      <Accordion.Title
        active={accordionState.term}
        content='Term'
        index='term'
        onClick={handleAccordion}
      />
      <Accordion.Content className='accordionContent' active={accordionState.term} content={TermFilter} />
    </Menu.Item>
    <Menu.Item>
      <Accordion.Title
        active={accordionState.campus}
        content='Campus'
        index='campus'
        onClick={handleAccordion}
      />
      <Accordion.Content className='accordionContent' active={accordionState.campus} content={CampusFilter} />
    </Menu.Item>
    <Menu.Item>
      <Accordion.Title
        active={accordionState.breadthHub}
        content='Breadth/Distribution'
        index='breadthHub'
        onClick={handleAccordion}
      />
      <Accordion.Content className='accordionContent'
        active={accordionState.breadthHub}
        content={multiCampus} />
    </Menu.Item>
  </Accordion>

}