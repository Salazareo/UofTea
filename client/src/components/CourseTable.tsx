import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Redirect, useLocation } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { RootState } from '../redux/reducers';
import { CourseSortOptions, parseQueryFromUrl, parseUrlFromQueryObj } from './CourseFilters';

export interface CourseTableData {
  courseCode: string;
  courseName: string;
  recommended: number | 'N/A';
  difficulty: number | 'N/A';
  workload: number | 'N/A';
}

export const CourseTable = (props: { courses: CourseTableData[] }) => {

  const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);

  const location = useLocation();
  const queryObj = parseQueryFromUrl(location.search);
  const { sort, ascending } = queryObj;
  const [{ filterSort, filterAscending }, changeSort] = useState({
    filterSort: sort || CourseSortOptions.recommended,
    filterAscending: ascending || 'descending'
  });
  if (sort !== filterSort || filterAscending !== ascending) {
    return <Redirect to={`/browse?${parseUrlFromQueryObj({ ...queryObj, sort: filterSort, ascending: filterAscending })}`} />
  }
  return <Table
    striped
    sortable inverted={darkmode}>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell
          onClick={() => {
            changeSort((oldValues) => {
              return {
                filterSort: CourseSortOptions.courseCode,
                filterAscending: oldValues.filterSort === 'courseCode' ? (oldValues.filterAscending === 'descending' ? 'ascending' : 'descending') : 'descending'
              }
            })
          }}
          sorted={sort === 'courseCode' ? (ascending || 'descending') : undefined}>
          Code
      </Table.HeaderCell>
        <Table.HeaderCell
          onClick={() => {
            changeSort((oldValues) => {
              return {
                filterSort: CourseSortOptions.courseName,
                filterAscending: oldValues.filterSort === 'courseName' ? (oldValues.filterAscending === 'descending' ? 'ascending' : 'descending') : 'descending'
              }
            })
          }}
          sorted={sort === 'courseName' ? (ascending || 'descending') : undefined}>
          Course Name
      </Table.HeaderCell>
        <Table.HeaderCell
          onClick={() => {
            changeSort((oldValues) => {
              return {
                filterSort: CourseSortOptions.recommended,
                filterAscending: oldValues.filterSort === 'recommended' ? (oldValues.filterAscending === 'descending' ? 'ascending' : 'descending') : 'descending'
              }
            })
          }}
          sorted={sort === 'recommended' ? (ascending || 'descending') : undefined}>
          Recommended
      </Table.HeaderCell>
        <Table.HeaderCell
          onClick={() => {
            changeSort((oldValues) => {
              return {
                filterSort: CourseSortOptions.difficulty,
                filterAscending: oldValues.filterSort === 'difficulty' ? (oldValues.filterAscending === 'descending' ? 'ascending' : 'descending') : 'descending'
              }
            })
          }}
          sorted={sort === 'difficulty' ? (ascending || 'descending') : undefined}>
          Difficulty
      </Table.HeaderCell>
        <Table.HeaderCell
          onClick={() => {
            changeSort((oldValues) => {
              return {
                filterSort: CourseSortOptions.workload,
                filterAscending: oldValues.filterSort === 'workload' ? (oldValues.filterAscending === 'descending' ? 'ascending' : 'descending') : 'descending'
              }
            })
          }}
          sorted={sort === 'workload' ? (ascending || 'descending') : undefined}>
          Workload
      </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {props.courses.map(({ courseCode, courseName, recommended, difficulty, workload }) => (
        <Table.Row key={courseCode}>
          <Table.Cell selectable className='courseLink' style={{ color: darkmode ? '#6495ED' : 'navy', fontWeight: '600' }}>
            <NavLink to={`/courses/${courseCode}`}>{courseCode}</NavLink>
          </Table.Cell>
          <Table.Cell >{courseName}</Table.Cell>
          <Table.Cell >{recommended !== 'N/A' ? recommended.toFixed(1) : recommended}{recommended !== 'N/A' ? '%' : ''}</Table.Cell>
          <Table.Cell >{difficulty !== 'N/A' ? difficulty.toFixed(1) : difficulty}{difficulty !== 'N/A' ? '%' : ''}</Table.Cell>
          <Table.Cell >{workload !== 'N/A' ? workload.toFixed(1) : workload}{workload !== 'N/A' ? '%' : ''}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
}