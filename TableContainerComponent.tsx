import { Input, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, } from '@mui/material';
import { optionOptimizeSettings } from '../../helpers/constants';
import { useDispatch, useSelector } from 'react-redux';
import { updateOptimizeSettingData, updateOptimizeSettingList } from '../../store/slices/sitePerformance/optimizeSettingSlice';
import { RootState } from '../../store';
import { useEffect } from 'react';
import { getMonthList, getOptimizeSettingist } from '../../store/slices/sitePerformance';
interface TableContainerProps {
  enable: string;
  readOnly? :boolean;
  siteId?: string;
}

export interface HeadCell {
  id: string;
  align: 'center' | 'left' | 'right' | 'justify' | 'inherit';
  disablePadding: boolean;
  label: string;
}

const headCells: HeadCell[] = [
  {
    id: "month",
    align: "center",
    disablePadding: false,
    label: "Month",
  },
  {
    id: "percent",
    align: "center",
    disablePadding: false,
    label: "Demand Limit",
  },
];

export const TableContainerComponent: React.FC<TableContainerProps> = ({siteId ="", enable = optionOptimizeSettings.NO,readOnly=false }) => {
  type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
  const dispatch = useDispatch();
    //const {monthList,optimizeSettingList} = useSelector((state: RootState) => state.optimizeSettings);
    const { monthList = [], optimizeSettingList } = useSelector((state: RootState) => state.optimizeSettings);

    useEffect(() => {
      if (Object.keys(monthList).length=== 0) {
        dispatch(getMonthList() );
      }
      if (Object.keys(monthList).length > 0) {
        dispatch(updateOptimizeSettingList({ months: monthList }));
      }
    }, [monthList,dispatch]); 
    if(readOnly)
    {
      dispatch(getOptimizeSettingist(siteId));
    }

  const handleChangeDemandLimit = (event: ChangeEvent, id: number) => {
    if (enable === optionOptimizeSettings.YES) {
      const { value } = event.target as HTMLInputElement;
      dispatch(updateOptimizeSettingData({ monthId: id, demandLimit: value }));
    }
  };
  const getMonthNameById = (monthId: number): string => {
    const month = monthList?.find((m) => m.id === monthId);
    return month ? month.name : '';
  };
  return (
    <TableContainer
        sx={{
      width: "100%",
      overflowX: "auto",
      overflowY: "auto",
      position: "relative",
      display: "block",
      maxWidth: "100%",
      maxHeight: "180px",

      "& td, & th": { whiteSpace: "nowrap" },
    }}
  >
    <Table
      stickyHeader
      aria-label="sticky table"
      aria-labelledby="tableTitle"
      sx={{
        "& .MuiTableCell-root:first-of-type": {
          pl: 2,
        },
        "& .MuiTableCell-root:last-child": {
          pr: 3,
        },
      }}
    >
    <TableHead>
      <TableRow>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            className={`${headCell.id ==='month'? "th-border":""}`}
            sx={{
              borderBottom: "1px solid rgba(224, 224, 224, 1);",
              fontFamily: "Inter",
              fontSize: 12,
              color: "#353739E5",
              padding:"10px!important"
            }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
      <TableBody>
        {optimizeSettingList.map((row) => {
          return (
            <TableRow
              hover
              sx={{
                fontFamily: "Inter",
                fontSize: 11,
                color: "#4A5568",
              }}
              tabIndex={-1}
              key={row.monthId}
            >
              <TableCell
                sx={{
                  borderBottom: "1px solid rgba(224, 224, 224, 1);",
                  borderRight: "1px solid rgba(224, 224, 224, 1);",
                  padding: "10px!important",
                }}
              >
                <Typography
                  data-testid="nameMonth"
                  fontSize={"0.688rem"}
                  color={"#4A5568"}
                  align="center"
                >
                  {getMonthNameById(row.monthId)}
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                valign="middle"
                sx={{
                  borderBottom: "1px solid rgba(224, 224, 224, 1);",
                  padding: "10px!important",
                }}
              >
                 {
                 <Input id="percentage-edit" data-testid='percentage-edit'
                 onChange={(e: ChangeEvent) => handleChangeDemandLimit(e, row.monthId)}
                 value={row.demandLimit}       
                 inputProps={{"aria-label": "percentage-edit",maxLength: 3,}}
                        endAdornment={<InputAdornment position="end">
                          <Typography sx={{ fontSize: "12px", color: "#008080" }}>%</Typography>
                        </InputAdornment>
                        }
                  sx={{paddingLeft: "4px",paddingRight: "4px",fontSize: "12px",height: "28px",width: "71px",borderRadius: "4px",border: "1px solid #0000001A",}}
                  disabled={enable !== optionOptimizeSettings.YES} 
                        />
                  }
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
  )
}