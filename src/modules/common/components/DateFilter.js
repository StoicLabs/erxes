import React from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import moment from 'moment';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Icon, Button } from 'modules/common/components';
import { router } from 'modules/common/utils';
import { PopoverButton } from 'modules/inbox/styles';
import {
  FlexRow,
  FlexItem,
  DateFilters
} from 'modules/inbox/components/sidebar/styles';

const propTypes = {
  queryParams: PropTypes.object,
  history: PropTypes.object,
  client: PropTypes.object,
  countQuery: PropTypes.string,
  countQueryParam: PropTypes.string
};

const format = 'YYYY-MM-DD HH:mm';

class DateFilter extends React.Component {
  constructor(props) {
    super(props);

    const { startDate, endDate } = props.queryParams;

    this.state = {
      startDate: null,
      endDate: null,
      totalCount: 0
    };

    if (startDate) {
      this.state.startDate = moment(startDate);
    }

    if (endDate) {
      this.state.endDate = moment(endDate);
    }

    this.renderPopover = this.renderPopover.bind(this);
    this.refetchCountQuery = this.refetchCountQuery.bind(this);
    this.renderCount = this.renderCount.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.filterByDate = this.filterByDate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { queryParams } = nextProps;

    if (nextProps.countQuery) {
      if (queryParams.startDate && queryParams.endDate) {
        this.refetchCountQuery();
      }
    }
  }

  onDateChange(type, date) {
    this.setState({ [type]: date });
  }

  refetchCountQuery() {
    const { client, queryParams, countQuery, countQueryParam } = this.props;

    client
      .query({
        query: gql(countQuery),
        variables: { ...queryParams }
      })

      .then(({ data }) => {
        this.setState({
          totalCount: data[countQueryParam]
        });
      });
  }

  filterByDate() {
    const { startDate, endDate } = this.state;

    const formattedStartDate = moment(startDate).format(format);
    const formattedEndDate = moment(endDate).format(format);

    router.setParams(this.props.history, {
      startDate: formattedStartDate,
      endDate: formattedEndDate
    });

    if (this.props.countQuery) {
      this.refetchCountQuery();
    }
  }

  renderCount() {
    const { totalCount } = this.state;
    const { __ } = this.context;

    if (this.props.countQuery) {
      return (
        <FlexRow>
          <FlexItem>
            <span>
              {__('Total')}: {totalCount}
            </span>
          </FlexItem>
        </FlexRow>
      );
    }

    return null;
  }

  renderPopover() {
    const { __ } = this.context;

    const props = {
      inputProps: { placeholder: __('Select a date') },
      timeFormat: 'HH:mm',
      dateFormat: 'YYYY/MM/DD',
      closeOnSelect: true
    };

    return (
      <Popover id="filter-popover" title={__('Filter by date')}>
        <DateFilters>
          <FlexRow>
            <FlexItem>
              <Datetime
                {...props}
                value={this.state.startDate}
                onChange={date => this.onDateChange('startDate', date)}
              />
            </FlexItem>

            <FlexItem>
              <Datetime
                {...props}
                value={this.state.endDate}
                onChange={date => this.onDateChange('endDate', date)}
              />
            </FlexItem>
          </FlexRow>

          {this.renderCount()}

          <FlexRow>
            <Button btnStyle="simple" onClick={() => this.filterByDate()}>
              Filter
            </Button>
          </FlexRow>
        </DateFilters>
      </Popover>
    );
  }

  render() {
    const { __ } = this.context;

    return (
      <OverlayTrigger
        ref={overlayTrigger => {
          this.overlayTrigger = overlayTrigger;
        }}
        trigger="click"
        placement="bottom"
        overlay={this.renderPopover()}
        container={this}
        shouldUpdatePosition
        rootClose
      >
        <PopoverButton>
          {__('Date')} <Icon icon="downarrow" />
        </PopoverButton>
      </OverlayTrigger>
    );
  }
}

DateFilter.propTypes = propTypes;
DateFilter.contextTypes = {
  __: PropTypes.func
};

export default withApollo(DateFilter);
