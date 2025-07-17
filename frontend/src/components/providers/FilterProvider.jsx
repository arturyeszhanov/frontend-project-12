import { useCallback } from 'react'
import PropTypes from 'prop-types'
import filter from 'leo-profanity'
import { FilterContext } from '../../contexts'

const FilterProvider = ({ children }) => {
  const filterWords = useCallback((word) => {
    filter.loadDictionary('en')
    const englishWord = filter.clean(word)
    filter.loadDictionary('ru')
    return filter.clean(englishWord)
  }, [])

  return (
    <FilterContext.Provider value={filterWords}>
      {children}
    </FilterContext.Provider>
  )
}

FilterProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default FilterProvider
