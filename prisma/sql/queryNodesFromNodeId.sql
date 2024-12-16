WITH RECURSIVE user_nodes AS (
  SELECT 
    node_id, 
    parent_node_id,
    type,
    name,
    user_id
  FROM 
    "nodes"
  WHERE 
    node_id = $1
  UNION 
    SELECT 
      r_nodes.node_id,
      r_nodes.parent_node_id,
      r_nodes.type,
      r_nodes.name,
      r_nodes.user_id
    FROM 
      "nodes" r_nodes 
    INNER JOIN user_nodes r_nodes1 
      ON r_nodes.parent_node_id = r_nodes1.node_id
) SELECT
  node_id "nodeId", 
  parent_node_id "parentNodeId",
  name,
  user_id "userId"
FROM 
  user_nodes
WHERE type = 'FOLDER';