package com.globalshop.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("blog_posts")
public class BlogPost {
    @TableId(type = IdType.ASSIGN_ID)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    private String title;
    private String slug;
    private String excerpt;
    private String content;
    private String coverImage;
    private String tags;
    private Integer status; // 0=草稿 1=已发布
    private Integer viewCount;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
