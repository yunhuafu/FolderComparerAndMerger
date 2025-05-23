import './TreeView.css'
import { useSelector } from 'react-redux'
import { selectComparisonResult } from '@renderer/app/comparisonResultSlice'
import { CustomComponentProps } from '../CustomComponent.types'
import { Box } from '@mui/material'
import { forwardRef } from 'react'
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { yellow } from '@mui/material/colors'
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp'
import KeyboardArrowRightSharpIcon from '@mui/icons-material/KeyboardArrowRightSharp'
import { ComparisonResult, ComparisonResultType } from 'src/models/ComparisonResult'
import TraverseResultItem from 'src/models/TraverseResultItem'

function traverse(
  comparisonResult: ComparisonResult,
  traverseResult: TraverseResultItem[],
  level: number
): void {
  const item: TraverseResultItem = new TraverseResultItem(
    comparisonResult?.leftFileSystemItem,
    comparisonResult?.rightFileSystemItem,
    comparisonResult?.comparisonResultType,
    level
  )
  traverseResult.push(item)
  comparisonResult.children?.forEach((child) => {
    traverse(child, traverseResult, level + 1)
  })
}

type TreeViewProps = CustomComponentProps & {
  isLeft: boolean
}

const TreeView = forwardRef<HTMLDivElement, TreeViewProps>((props, ref) => {
  const comparisonResult = useSelector(selectComparisonResult)
  const traverseResult: TraverseResultItem[] = []
  traverse(comparisonResult, traverseResult, 0)

  const treeNodes = traverseResult.map((traverseResultItem) => {
    let backgroundColor = 'White'
    switch (traverseResultItem.comparisonResultType) {
      case ComparisonResultType.SAME:
        backgroundColor = 'White'
        break
      case ComparisonResultType.DIFFERENT:
        backgroundColor = '#fff3cd'
        break
      case ComparisonResultType.LEFT_ONLY:
        if (props.isLeft == true) backgroundColor = '#d1c4e9'
        break
      case ComparisonResultType.RIGHT_ONLY:
        if (props.isLeft == false) backgroundColor = '#d1c4e9'
        break
    }

    let treeNode = traverseResultItem.leftFileSystemItem
    if (props.isLeft == false) treeNode = traverseResultItem.rightFileSystemItem

    if (treeNode) {
      return (
        <div
          key={treeNode?.name}
          style={{
            paddingLeft: `${traverseResultItem.level * 20}px`,
            backgroundColor: `${backgroundColor}`,
            border: '1px solid white ',
            borderRadius: '8px'
          }} // 20px per level
        >
          {treeNode?.isDirectory && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <KeyboardArrowDownSharpIcon />
              <FolderIcon sx={{ color: yellow[500] }}></FolderIcon>
              <span>{treeNode?.name}</span>
            </div>
          )}
          {!treeNode?.isDirectory && (
            <div style={{ paddingLeft: '20px', display: 'flex', alignItems: 'center' }}>
              <InsertDriveFileIcon sx={{ color: '#4da6ff' }}></InsertDriveFileIcon>
              <span>{treeNode?.name}</span>
            </div>
          )}
        </div>
      )
    } else {
      return (
        <div
          key={-1}
          style={{
            paddingLeft: `${traverseResultItem.level * 20}px`,
            backgroundColor: `${backgroundColor}`
          }} // 20px per level
        >
          <p>&nbsp;</p>
        </div>
      )
    }
  })

  return (
    <Box ref={ref} {...props}>
      <div className="treeViewContainer">{treeNodes}</div>
    </Box>
  )
})

TreeView.displayName = 'TreeView'

export default TreeView
