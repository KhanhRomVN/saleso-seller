import { Space, Tag, Tooltip } from 'antd'

export const getPrice = (record) => {
  if (typeof record.price === 'number') {
    return record.price.toFixed(2)
  } else if (record.attributes && typeof record.attributes === 'object') {
    const prices = Object.values(record.attributes)
      .flat()
      .map((attr) => (typeof attr === 'object' && attr !== null ? attr.price : undefined))
      .filter((price) => typeof price === 'number')
    return prices.length > 0 ? Math.min(...prices).toFixed(2) : 'N/A'
  }
  return 'N/A'
}

export const truncateName = (name, maxLength = 30) => {
  return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name
}

export const renderDiscounts = (discounts, color) => {
  if (!discounts || discounts.length === 0) {
    return <span>N/A</span>
  }

  return (
    <Space>
      <Tag color={color} style={{ margin: '2px' }}>
        {discounts[0].description}
      </Tag>
      {discounts.length > 1 && (
        <Tooltip
          title={discounts
            .slice(1)
            .map((d) => d.description)
            .join(', ')}
        >
          <Tag color={color} style={{ margin: '2px' }}>
            +{discounts.length - 1}
          </Tag>
        </Tooltip>
      )}
    </Space>
  )
}
