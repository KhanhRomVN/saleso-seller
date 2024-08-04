import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Tabs, message } from 'antd'
import { BACKEND_URI } from '~/API'
import { DiscountGrid, DiscountDetailModal } from './components/DiscountTabsComponents'

const { TabPane } = Tabs

const DiscountTabs = () => {
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState(null)

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const { data } = await axios.get(`${BACKEND_URI}/discount/all`, {
          headers: { accessToken },
        })
        setDiscounts(data)
      } catch (error) {
        console.error('Error fetching discounts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscounts()
  }, [])

  const filterDiscounts = (filter) => {
    const now = new Date()
    switch (filter) {
      case 'upcoming':
        return discounts.filter((d) => new Date(d.startDate) > now)
      case 'ongoing':
        return discounts.filter((d) => new Date(d.startDate) <= now && new Date(d.endDate) >= now)
      case 'expired':
        return discounts.filter((d) => new Date(d.endDate) < now)
      case 'active':
        return discounts.filter((d) => d.isActive)
      case 'non-active':
        return discounts.filter((d) => !d.isActive)
      default:
        return discounts
    }
  }

  const handleSelectDiscount = (discount) => {
    setSelectedDiscount(discount)
    setModalVisible(true)
  }

  const handleUpdateDiscount = async (discountId, field, value) => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      await axios.patch(
        `${BACKEND_URI}/discount/${discountId}/${field}`,
        { [field]: value },
        {
          headers: { accessToken },
        },
      )
      message.success(`Discount ${field} updated successfully`)
      // Update the local state
      setDiscounts(discounts.map((d) => (d._id === discountId ? { ...d, [field]: value } : d)))
    } catch (error) {
      console.error(`Error updating discount ${field}:`, error)
      message.error(`Failed to update discount ${field}`)
    }
  }

  return (
    <>
      <Tabs defaultActiveKey="all">
        <TabPane tab="All" key="all">
          <DiscountGrid discounts={discounts} onSelectDiscount={handleSelectDiscount} />
        </TabPane>
        <TabPane tab="Up Coming" key="upcoming">
          <DiscountGrid discounts={filterDiscounts('upcoming')} onSelectDiscount={handleSelectDiscount} />
        </TabPane>
        <TabPane tab="On Going" key="ongoing">
          <DiscountGrid discounts={filterDiscounts('ongoing')} onSelectDiscount={handleSelectDiscount} />
        </TabPane>
        <TabPane tab="Expired" key="expired">
          <DiscountGrid discounts={filterDiscounts('expired')} onSelectDiscount={handleSelectDiscount} />
        </TabPane>
        <TabPane tab="Active" key="active">
          <DiscountGrid discounts={filterDiscounts('active')} onSelectDiscount={handleSelectDiscount} />
        </TabPane>
        <TabPane tab="Non-Active" key="non-active">
          <DiscountGrid discounts={filterDiscounts('non-active')} onSelectDiscount={handleSelectDiscount} />
        </TabPane>
      </Tabs>
      <DiscountDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        discount={selectedDiscount}
        onUpdateDiscount={handleUpdateDiscount}
      />
    </>
  )
}

export default DiscountTabs
