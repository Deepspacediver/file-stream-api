WITH RECURSIVE user_nodes AS (
  SELECT 
    node_id, 
    parent_node_id,
    name 
  FROM 
    "nodes"
  WHERE 
    user_id = $1 AND node_id = $2
  UNION 
    SELECT 
      r_nodes.node_id,
      r_nodes.parent_node_id,
      r_nodes.name 
    FROM 
      "nodes" r_nodes 
    INNER JOIN user_nodes r_nodes1 
      ON r_nodes.parent_node_id = r_nodes1.node_id
) SELECT
  *
FROM 
  user_nodes;