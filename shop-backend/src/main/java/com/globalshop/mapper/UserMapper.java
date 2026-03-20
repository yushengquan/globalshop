package com.globalshop.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.globalshop.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
