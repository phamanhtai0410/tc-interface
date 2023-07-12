import React from 'react'
import classNames from 'classnames'
import { Segment } from 'components/ui'
import { HiCheckCircle } from 'react-icons/hi'
import isLastChild from 'utils/isLastChild'

const segmentSelections = [
    { value: 'A', disabled: false },
    { value: 'B', disabled: false },
    { value: 'C', disabled: false },
    { value: 'D', disabled: false },
    { value: 'E', disabled: false },
    { value: 'F', disabled: false },
    { value: 'G', disabled: false },
]

const AnalytisSegment = () => {
    return (
        <Segment defaultValue={['Team']} className="gap-4 md:flex-row flex-col">
            {segmentSelections.map((item, index) => (
                <Segment.Item
                    value={item.value}
                    key={item.value}
                    disabled={item.disabled}
                >
                    {({ ref, active, value, onSegmentItemClick, disabled }) => {
                        return (
                            <div
                                ref={ref}
                                className={classNames(
                                    'flex',
                                    'ring-1',
                                    'justify-between',
                                    'border',
                                    'rounded-md ',
                                    'border-gray-300',
                                    'py-[8px] px-[24px]',
                                    'cursor-pointer',
                                    'select-none',
                                    'w-[59px]',
                                    'md:w-[59px]',
                                    active
                                        ? 'ring-cyan-500 border-cyan-500'
                                        : 'ring-transparent',
                                    disabled
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:ring-cyan-500 hover:border-cyan-500'
                                )}
                                onClick={onSegmentItemClick}
                            >
                                <div>
                                    <h6>{value}</h6>
                                    {/* <p>{item.desc}</p> */}
                                </div>
                                {active && (
                                    <HiCheckCircle className="text-cyan-500 text-xl" />
                                )}
                            </div>
                        )
                    }}
                </Segment.Item>
            ))}
        </Segment>
    )
}

export default AnalytisSegment