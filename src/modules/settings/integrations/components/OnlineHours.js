import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-plus';
import { days, hours } from '../constants';
import {
  Button,
  Icon,
  FormGroup,
  ControlLabel
} from 'modules/common/components';
import { FlexRow } from '../../styles';

class OnlineHours extends Component {
  constructor(props) {
    super(props);

    this.state = { onlineHours: props.prevOptions || [] };

    this.addTime = this.addTime.bind(this);
    this.removeTime = this.removeTime.bind(this);
  }

  onTimeItemChange(onlineHourId, name, value) {
    const onlineHours = this.state.onlineHours;

    // find current editing one
    const onlineHour = onlineHours.find(hour => hour._id === onlineHourId);

    // set new value
    onlineHour[name] = value;

    this.setState({ onlineHours });

    // notify as change to main component
    this.props.onChange(onlineHours);
  }

  addTime() {
    const onlineHours = this.state.onlineHours.slice();

    onlineHours.push({
      _id: Math.random().toString(),
      day: days[0].value,
      from: hours[0].value,
      to: hours[0].value
    });

    this.setState({ onlineHours });

    // notify as change to main component
    this.props.onChange(onlineHours);
  }

  removeTime(onlineHourId) {
    let onlineHours = this.state.onlineHours;

    onlineHours = onlineHours.filter(hour => hour._id !== onlineHourId);

    this.setState({ onlineHours });

    // notify as change to main component
    this.props.onChange(onlineHours);
  }

  renderOnlineHour(onlineHour) {
    const remove = () => {
      this.removeTime(onlineHour._id);
    };

    const onDayChange = e => {
      this.onTimeItemChange(onlineHour._id, 'day', e.value);
    };

    const onFromChange = e => {
      this.onTimeItemChange(onlineHour._id, 'from', e.value);
    };

    const onToChange = e => {
      this.onTimeItemChange(onlineHour._id, 'to', e.value);
    };

    const { _id, day, from, to } = onlineHour;
    return (
      <FlexRow key={_id}>
        <Select
          className="flex-item"
          value={day}
          options={days}
          onChange={onDayChange}
          clearable={false}
        />
        <span>from</span>
        <Select
          className="flex-item"
          onChange={onFromChange}
          value={from}
          options={hours}
          clearable={false}
        />
        <span>to</span>
        <Select
          className="flex-item"
          onChange={onToChange}
          value={to}
          options={hours}
          clearable={false}
        />

        <Button size="small" btnStyle="danger" onClick={remove}>
          <Icon icon="cancel-1" />
        </Button>
      </FlexRow>
    );
  }

  render() {
    return (
      <FormGroup>
        <ControlLabel>Online hours</ControlLabel>

        {this.state.onlineHours.map(onlineHour =>
          this.renderOnlineHour(onlineHour)
        )}
        <Button
          btnStyle="success"
          size="small"
          onClick={this.addTime}
          icon="add"
        >
          Add another time
        </Button>
      </FormGroup>
    );
  }
}

OnlineHours.propTypes = {
  prevOptions: PropTypes.array, // eslint-disable-line
  onChange: PropTypes.func.isRequired
};

export default OnlineHours;
