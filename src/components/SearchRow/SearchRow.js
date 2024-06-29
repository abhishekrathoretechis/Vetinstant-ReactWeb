import { Grid } from "@mui/material";
import CustomButton from "../CustomButton";
import CustomTextField from "../CustomTextField";
import "./SearchRow.css";
// import ListIcon from "@mui/icons-material/List";
// import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import PropTypes from "prop-types";
import CustomSelect from "../Select/Select";
// import { AppColors } from "../../util/AppColors";

const SearchRow = ({
  leftBtnTxt,
  rightBtnTxt,
  onClickRedBtn,
  onClickBlueBtn,
  cardView,
  tableView,
  onClickCardView,
  onClickTableView,
  searchValue,
  onSerchChange,
  searchTypeList,
  searchTypeValue,
  handleChangeSearchValue,
  isCustomSty,
  customSty,
  dateFilter,
  dateFilterTypeList,
  dateFilterValue,
  onChangeDateFilterValue,
  searchByCondition,
  searchByConditionSelected,
  searchByConditionList,
  searchByConditionValue,
  handleChangeSearchConditionValue,
}) => {
  return (
    <div
      style={{ ...customSty }}
      className={isCustomSty ? "" : "searchRow-main"}
    >
      <Grid container spacing={1} direction="row" alignItems="center">
        {searchByCondition ? (
          searchByConditionSelected ? (
            <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
              <div className="searchRow-search-left">
                <CustomSelect
                  label="Search Condition"
                  list={searchByConditionList}
                  value={searchByConditionValue}
                  handleChange={handleChangeSearchConditionValue}
                />
              </div>
            </Grid>
          ) : null
        ) : (
          <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
            <div className="searchRow-search-left">
              <CustomTextField
                fullWidth
                label="Search"
                search
                value={searchValue}
                handleChange={onSerchChange}
              />
            </div>
          </Grid>
        )}
        <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
          <div className="searchRow-search-right">
            <CustomSelect
              label="Search Type"
              list={searchTypeList}
              value={searchTypeValue}
              handleChange={handleChangeSearchValue}
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
          <div className="searchRow-row">
            <div className="searchRow-btn-space">
              <CustomButton
                text={leftBtnTxt}
                redBtn={true}
                smallBtn={true}
                onClick={onClickRedBtn}
              />
            </div>
            <div className="searchRow-btn-space">
              <CustomButton
                text={rightBtnTxt}
                smallBtn={true}
                onClick={onClickBlueBtn}
              />
            </div>
            {dateFilter ? (
              <CustomSelect
                label="Filter Type"
                list={dateFilterTypeList}
                value={dateFilterValue}
                handleChange={onChangeDateFilterValue}
              />
            ) : null}
          </div>
        </Grid>
        {/* <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
          <div className="searchRow-row-end">
            <div className="searchRow-btn-space">
              <ListIcon
                style={{
                  color: tableView ? AppColors.appPrimary : AppColors.black,
                }}
                onClick={onClickTableView}
              />
            </div>
            <div className="searchRow-btn-space">
              <GridViewOutlinedIcon
                style={{
                  color: cardView ? AppColors.appPrimary : AppColors.black,
                }}
                onClick={onClickCardView}
              />
            </div>
          </div>
        </Grid> */}
      </Grid>
    </div>
  );
};

SearchRow.propTypes = {
  leftBtnTxt: PropTypes.string,
  rightBtnTxt: PropTypes.string,
  onClickRedBtn: PropTypes.func,
  onClickBlueBtn: PropTypes.func,
  cardView: PropTypes.bool,
  tableView: PropTypes.bool,
  onClickCardView: PropTypes.func,
  onClickTableView: PropTypes.func,
  searchValue: PropTypes.string,
  onChange: PropTypes.func,
  searchTypeList: PropTypes.array,
  searchTypeValue: PropTypes.string,
  handleChangeSearchValue: PropTypes.func,
  isCustomSty: PropTypes.bool,
  customSty: PropTypes.object,
  dateFilter: PropTypes.bool,
  dateFilterTypeList: PropTypes.array,
  dateFilterValue: PropTypes.string,
  onChangeDateFilterValue: PropTypes.func,
  searchByCondition: PropTypes.bool,
  searchByConditionSelected: PropTypes.bool,
  searchByConditionList: PropTypes.array,
  searchByConditionValue: PropTypes.string,
  handleChangeSearchConditionValue: PropTypes.func,
};

SearchRow.defaultProps = {
  leftBtnTxt: "",
  rightBtnTxt: "",
  onClickRedBtn: () => { },
  onClickBlueBtn: () => { },
  cardView: false,
  tableView: false,
  onClickCardView: () => { },
  onClickTableView: () => { },
  searchValue: "",
  onSerchChange: () => { },
  searchTypeList: [],
  searchTypeValue: null,
  handleChangeSearchValue: () => { },
  isCustomSty: false,
  customSty: {},
  dateFilter: false,
  dateFilterTypeList: [],
  dateFilterValue: "",
  onChangeDateFilterValue: () => { },
  searchByCondition: false,
  searchByConditionSelected: false,
  searchByConditionList: [],
  searchByConditionValue: null,
  handleChangeSearchConditionValue: () => { },
};

export default SearchRow;
