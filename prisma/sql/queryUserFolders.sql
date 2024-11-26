WITH RECURSIVE user_nodes AS (
  SELECT 
    node_id, 
    parent_node_id,
    type,
    name
  FROM 
    "nodes"
  WHERE 
    user_id = $1 AND parent_node_id IS NULL
  UNION 
    SELECT 
      r_nodes.node_id,
      r_nodes.parent_node_id,
      r_nodes.type,
      r_nodes.name
    FROM 
      "nodes" r_nodes 
    INNER JOIN user_nodes r_nodes1 
      ON r_nodes.parent_node_id = r_nodes1.node_id
) SELECT
  node_id, name
FROM 
  user_nodes
WHERE 
  user_nodes.type = 'FOLDER'
;